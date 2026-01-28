# fuel_calculator.py

class FuelCalculator:
    def __init__(self):
        self.consumptions = []
        self.fuel_at_start_of_lap = None
        self.last_lap_fuel_usage = 0.0
        self.last_lap_completed = -1
        
    def process_data(self, current_fuel, current_lap):
        if self.fuel_at_start_of_lap is None:
            self.fuel_at_start_of_lap = current_fuel
            self.last_lap_completed = current_lap
            return

        # Detectar cierre de vuelta
        if current_lap > self.last_lap_completed:
            consumed = self.fuel_at_start_of_lap - current_fuel
            if 0 < consumed < 15: # Validar que no sea un repostaje o error
                self.consumptions.append(consumed)
                self.last_lap_fuel_usage = consumed
            
            self.fuel_at_start_of_lap = current_fuel
            self.last_lap_completed = current_lap

    def get_average(self):
        if not self.consumptions: return 0.0
        relevant = self.consumptions[-5:]
        return sum(relevant) / len(relevant)

    def get_current_lap_prediction(self, current_fuel):
        """Calcula cuánto llevas gastado en esta vuelta actual."""
        if self.fuel_at_start_of_lap is None: return 0.0
        return self.fuel_at_start_of_lap - current_fuel

    def calculate_fuel_to_finish(self, current_fuel, time_left_seconds, avg_lap_time):
        """Predice el combustible necesario basado en el tiempo restante de sesión."""
        if avg_lap_time <= 0 or time_left_seconds <= 0: return 0.0
        
        avg_cons = self.get_average()
        if avg_cons <= 0: return 0.0

        vueltas_estimadas = (time_left_seconds / avg_lap_time) + 1 # +1 de margen/vuelta final
        fuel_necesario = vueltas_estimadas * avg_cons
        
        # Retorna cuánto falta por añadir (o 0 si ya tienes suficiente)
        return max(0, fuel_necesario - current_fuel)