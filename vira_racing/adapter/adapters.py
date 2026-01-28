# adapters.py
import threading, time, json, mmap, ctypes, asyncio, websockets
from .rf2_structures import rF2Telemetry, rF2Scoring
from strategy.fuel_calculator import FuelCalculator

class BaseAdapter:
    def __init__(self):
        self.fuel = 0.0
        self.lap = 0
        self.session_time_left = 0.0
        self.avg_lap_time = 0.0
        self.connected = False
        self.running = False
        
        self.strategy = FuelCalculator()
        # Métricas calculadas para la UI
        self.avg_cons = 0.0
        self.last_lap_cons = 0.0
        self.current_lap_cons = 0.0
        self.fuel_to_add = 0.0

    def update_metrics(self):
        self.strategy.process_data(self.fuel, self.lap)
        self.avg_cons = self.strategy.get_average()
        self.last_lap_cons = self.strategy.last_lap_fuel_usage
        self.current_lap_cons = self.strategy.get_current_lap_prediction(self.fuel)
        self.fuel_to_add = self.strategy.calculate_fuel_to_finish(
            self.fuel, self.session_time_left, self.avg_lap_time
        )

class RF2SharedMemoryAdapter(BaseAdapter):
    def start(self):
        self.running = True
        threading.Thread(target=self._worker, daemon=True).start()

    def _worker(self):
        while self.running:
            try:
                with mmap.mmap(-1, ctypes.sizeof(rF2Telemetry), "$rFactor2SMMP_Telemetry$", access=mmap.ACCESS_READ) as mt:
                    with mmap.mmap(-1, ctypes.sizeof(rF2Scoring), "$rFactor2SMMP_Scoring$", access=mmap.ACCESS_READ) as ms:
                        self.connected = True
                        while self.running:
                            t_data = rF2Telemetry.from_buffer_copy(mt)
                            s_data = rF2Scoring.from_buffer_copy(ms)
                            p_tel = t_data.mVehicles[0]
                            p_sco = s_data.mVehicles[0]
                            
                            self.fuel = p_tel.mFuel
                            self.lap = p_sco.mTotalLaps
                            self.session_time_left = s_data.mEndET - s_data.mCurrentET
                            # rF2 usa segundos para BestLapTime
                            self.avg_lap_time = p_sco.mLastLapTime if p_sco.mLastLapTime > 0 else 90.0
                            
                            self.update_metrics()
                            time.sleep(0.1)
            except:
                self.connected = False
                time.sleep(2)

class LMUWebAPIAdapter(BaseAdapter):
    def start(self):
        self.running = True
        threading.Thread(target=self._start_async, daemon=True).start()

    def _start_async(self):
        asyncio.run(self._listen())

    async def _listen(self):
        uri_tel = "ws://localhost:5397/webapi/v1/telemetry"
        # En LMU, el tiempo de sesión suele venir en un endpoint de timing o session
        while self.running:
            try:
                async with websockets.connect(uri_tel) as ws:
                    self.connected = True
                    while self.running:
                        msg = await ws.recv()
                        d = json.loads(msg)
                        self.fuel = d.get("fuel", 0.0)
                        self.lap = d.get("lapNumber", 0)
                        # Nota: LMU API puede requerir un fetch extra para sessionTime
                        self.session_time_left = d.get("sessionTimeRemaining", 3600.0)
                        self.avg_lap_time = d.get("lastLapTime", 120.0)
                        
                        self.update_metrics()
            except:
                self.connected = False
                await asyncio.sleep(2)