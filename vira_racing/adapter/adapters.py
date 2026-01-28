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

class BaseAdapter:
    def __init__(self, shared_data):
        self.data = shared_data
        self.running = False
        self.fuel_start_lap = None

    def stop(self):
        self.running = False
        self.data.is_connected = False

class RF2Adapter(BaseAdapter):
    def __init__(self, shared_data):
        super().__init__(shared_data)
        self.last_fuel_level = 0.0
        self.inst_cons_buffer = deque(maxlen=20)

    def start(self):
        self.running = True
        self.last_fuel_level = 0.0
        self.fuel_start_lap = None
        threading.Thread(target=self._worker, daemon=True).start()

    def _worker(self):
        mem_ctrl = MMapControl(LMUConstants.LMU_SHARED_MEMORY_FILE, LMUObjectOut)
        
        try:
            mem_ctrl.create(access_mode=1)
            
            while self.running:
                lmu_payload = mem_ctrl.data
                
                if lmu_payload.generic.gameVersion > 0:
                    self.data.is_connected = True
                    idx = lmu_payload.telemetry.playerVehicleIdx
                    p_tele = lmu_payload.telemetry.telemInfo[idx]
                    p_scor = lmu_payload.scoring.vehScoringInfo[idx]
                    
                    curr_fuel = p_tele.mFuel
                    dt = p_tele.mDeltaTime

                    # --- 1. CONSUMO INSTANTÁNEO SUAVIZADO ---
                    if dt > 0 and self.last_fuel_level > 0:
                        fuel_diff = self.last_fuel_level - curr_fuel
                        if 0 <= fuel_diff < 0.2:
                            raw_inst = (fuel_diff / dt) * 3600
                            self.inst_cons_buffer.append(raw_inst)
                            if len(self.inst_cons_buffer) > 0:
                                self.data.instant_cons = sum(self.inst_cons_buffer) / len(self.inst_cons_buffer)
                    
                    self.last_fuel_level = curr_fuel

                    # --- 2. VUELTAS ESTIMADAS (DINÁMICAS) ---
                    # Usamos el tiempo de vuelta actual si ya llevamos tiempo en pista, 
                    # si no, una referencia de 100 segundos para no dividir por cero.
                    ref_time = p_scor.mLastLapTime if p_scor.mLastLapTime > 0 else p_scor.mBestLapTime
                    if ref_time <= 0: ref_time = 100.0 

                    # Calculamos el gasto por vuelta basado en el consumo instantáneo
                    # Si el coche está al ralentí o parado, instant_cons será muy bajo.
                    if self.data.instant_cons > 1.0:
                        fuel_per_sec = self.data.instant_cons / 3600
                        est_burn_per_lap = fuel_per_sec * ref_time
                        
                        # Actualizamos el valor de la interfaz
                        self.data.laps_estimated = curr_fuel / est_burn_per_lap
                    else:
                        # Si no hay consumo instantáneo (parado), intentamos usar el histórico
                        if self.data.avg_cons > 0:
                            self.data.laps_estimated = curr_fuel / self.data.avg_cons
                        else:
                            self.data.laps_estimated = 0.0

                    # --- 3. DATOS DE SESIÓN ---
                    self.data.fuel = curr_fuel
                    self.data.lap = p_scor.mTotalLaps
                    self.data.session_time_left = lmu_payload.scoring.scoringInfo.mEndET - lmu_payload.scoring.scoringInfo.mCurrentET
                    self.data.last_lap_time = p_scor.mLastLapTime

                    # --- 4. CONSUMO MEDIO (POR VUELTA) ---
                    if self.fuel_start_lap is None:
                        self.fuel_start_lap = curr_fuel

                    if self.data.lap != p_scor.mTotalLaps:
                        if self.fuel_start_lap > curr_fuel:
                            self.data.last_lap_cons = self.fuel_start_lap - curr_fuel
                            self.data.avg_cons = self.data.last_lap_cons
                        self.fuel_start_lap = curr_fuel

                else:
                    self.data.is_connected = False
                
                time.sleep(0.1)
                
        except Exception as e:
            print(f"Error: {e}")
        finally:
            mem_ctrl.close()

class LMUAdapter(BaseAdapter):
    """Adaptador para LMU vía WebAPI (WebSockets)."""
    def start(self):
        self.running = True
        threading.Thread(target=lambda: asyncio.run(self._listen()), daemon=True).start()

    async def _listen(self):
        uri = "ws://localhost:5397/webapi/v1/telemetry"
        while self.running:
            try:
                async with websockets.connect(uri) as ws:
                    self.data.is_connected = True
                    while self.running:
                        msg = await ws.recv()
                        d = json.loads(msg)
                        
                        # Mapeo de campos desde la JSON API de LMU
                        self.data.fuel = d.get("fuel", 0.0)
                        
                        new_lap = d.get("lapNumber", 0)
                        if new_lap > self.data.lap:
                            if self.fuel_start_lap is not None:
                                self.data.last_lap_cons = self.fuel_start_lap - self.data.fuel
                                self.data.avg_cons = self.data.last_lap_cons
                            self.fuel_start_lap = self.data.fuel
                            self.data.lap = new_lap
                        
                        self.data.session_time_left = d.get("sessionTimeRemaining", 0.0)
                        self.data.last_lap_time = d.get("lastLapTime", 0.0)
                        
                        self.calculate_strategy()
            except:
                self.data.is_connected = False
                if self.running:
                    await asyncio.sleep(2)