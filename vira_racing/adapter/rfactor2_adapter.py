from collections import deque
import threading
import time
import json
import asyncio
import websockets
import logging
# Importamos la lógica de los archivos que subiste
from lmusdk.lmu_mmap import MMapControl
from lmusdk.lmu_data import LMUConstants, LMUObjectOut

# Configuración básica de logging para que MMapControl no de error
logging.basicConfig(level=logging.INFO)

class RF2Adapter:
    def __init__(self, shared_data):
        self.data = shared_data
        self.running = False
        self.last_fuel_level = 0.0
        self.fuel_start_lap = None
        self.inst_cons_buffer = deque(maxlen=20)
        self.weather = "Cargando..."

    def start(self):
        self.running = True
        threading.Thread(target=self._worker, daemon=True).start()

    def stop(self):
        self.running = False

    def _worker(self):
        # Desactivamos el log de buffer error para no ensuciar la consola
        logging.getLogger('concurrent.futures').setLevel(logging.ERROR)
        
        mem_ctrl = MMapControl(LMUConstants.LMU_SHARED_MEMORY_FILE, LMUObjectOut)
        
        try:
            # Importante: create(1) crea una vista directa. 
            # Si da error de buffer, podrías probar con create(0) que hace copia.
            mem_ctrl.create(access_mode=1)
            
            while self.running:
                lmu_payload = mem_ctrl.data
                
                # Verificación extra de seguridad
                if lmu_payload and lmu_payload.generic.gameVersion > 0:
                    
                    # CORRECCIÓN ÍNDICE: Aseguramos que sea un entero (int)
                    player_idx = int(lmu_payload.telemetry.playerVehicleIdx)
                    
                    # Validamos que el índice esté en rango (0 a 103)
                    if 0 <= player_idx < LMUConstants.MAX_MAPPED_VEHICLES:
                        self.data.is_connected = True
                        
                        p_tele = lmu_payload.telemetry.telemInfo[player_idx]
                        p_scor = lmu_payload.scoring.vehScoringInfo[player_idx]
                        s_info = lmu_payload.scoring.scoringInfo

                        # --- Datos de Sesión ---
                        try:
                            self.data.track_name = s_info.mTrackName.decode('utf-8', 'ignore').strip()
                        except:
                            self.data.track_name = "Cargando..."

                        # --- Lógica de Consumo ---
                        curr_fuel = float(p_tele.mFuel)
                        dt = float(p_tele.mDeltaTime)

                        if dt > 0 and self.last_fuel_level > 0:
                            fuel_diff = self.last_fuel_level - curr_fuel
                            if 0 <= fuel_diff < 0.2:
                                raw_inst = (fuel_diff / dt) * 3600
                                self.inst_cons_buffer.append(raw_inst)
                                if len(self.inst_cons_buffer) > 0:
                                    self.data.instant_cons = sum(self.inst_cons_buffer) / len(self.inst_cons_buffer)
                        
                        self.last_fuel_level = curr_fuel
                        self.data.fuel = curr_fuel
                        self.data.lap = p_scor.mTotalLaps

                        # --- Vueltas Estimadas ---
                        ref_time = p_scor.mLastLapTime if p_scor.mLastLapTime > 0 else 100.0
                        if self.data.instant_cons > 1.0:
                            fuel_per_sec = self.data.instant_cons / 3600
                            self.data.laps_estimated = curr_fuel / (fuel_per_sec * ref_time)
                        
                        # --- Sesión ---
                        self.data.session_time_left = s_info.mEndET - s_info.mCurrentET
                        self.data.track_temp = s_info.mTrackTemp
                        self.data.ambient_temp = s_info.mAmbientTemp

                        lluvia = s_info.mRaining
                        if lluvia == 0:
                            self.data.weather = "SOLEADO"
                        elif 0 < lluvia < 0.3:
                            self.data.weather = "CHUBASCOS"
                        elif 0.3 <= lluvia < 0.7:
                            self.data.weather = "LLUVIA MODERADA"
                        else:
                            self.data.weather = "TORMENTA / MUY MOJADO"
                        lluvia_raw = float(getattr(s_info, 'mRaining', 0.0))
                        self.data.rain_percent = lluvia_raw * 107 
                        self.data.wet_percent = float(getattr(s_info, 'mAvgPathWetness', 0.0)) * 100
                else:
                    self.data.is_connected = False
                
                time.sleep(0.1)
                
        except Exception as e:
            print(f"Error en bucle: {e}")
        finally:
            # Para evitar el 'Buffer Error', primero invalidamos la referencia a los datos
            mem_ctrl.data = None 
            time.sleep(0.1)
            try:
                mem_ctrl.close()
            except:
                pass # Ignoramos el error de cierre si el GC ya lo hizo