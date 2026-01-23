export interface DriverTiming {
  position: number;       // Global
  classPosition: number;  // En su categoría
  carName: string;
  positionChange: number; // Positivo, negativo o cero
  name: string;
  laps: number;
  class: 'HYPERCAR' | 'LMP2' | 'GT3';
  lastLap: string;
  bestLap: string;
  gapToLeader: string;
  interval: string;
  pits: number;
  isPitLane: boolean;
  sector1: string; // Colores: 'purple' (best), 'green' (personal best), 'yellow' (slow)
  sector2: string;
  sector3: string;
  tyreAge: number;
}