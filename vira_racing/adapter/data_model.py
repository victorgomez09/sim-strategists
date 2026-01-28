class SimData:
    def __init__(self):
        # Datos crudos
        self.fuel = 0.0
        self.lap = 0
        self.session_time_left = 0.0
        
        # Datos calculados (Estrategia)
        self.instant_cons = 0.0
        self.avg_cons = 0.0
        self.last_lap_cons = 0.0
        self.current_lap_cons = 0.0
        self.fuel_to_add = 0.0
        self.laps_estimated = 0.0
        
        # Estado de conexión
        self.is_connected = False
        self.active_source = "None"