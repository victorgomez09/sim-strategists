export interface FuelData {
  currentFuel: number;          // Litros actuales
  virtualEnergy?: number;       // % Energía Virtual (LMU/Hypercar)
  avgConsumption: number;       // Consumo medio por vuelta
  lapsRemainingOnFuel: number;  // Vueltas estimadas con lo que hay
  fuelRequiredToEnd: number;    // Litros necesarios para terminar
  fuelDelta: number;            // Diferencia (Positivo = Sobra / Negativo = Falta)
  extraLapsMargin: number;      // Margen de seguridad (ej: +2 vueltas)
  isEnergyLimited: boolean;     // Indica si el límite es el combustible o la energía
}