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

        # sesion
        self.track_name = ""
        self.session_type = ""
        self.ambient_temp = 0.0
        self.track_temp = 0.0
        self.weather = ""
        self.rain_percent = 0.0
        self.wet_percent = 0.0
        
        # Estado de conexión
        self.is_connected = False
        self.active_source = "None"