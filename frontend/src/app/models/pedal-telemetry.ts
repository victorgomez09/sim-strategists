export interface PedalInputs {
  throttle: number;      // 0-100
  brake: number;         // 0-100
  clutch: number;        // 0-100
  isCoasting: boolean;   // ¿Está el piloto planeando sin gas ni freno?
  liftAndCoastPoint: number; // Punto donde levantó el pie (en metros o % de recta)
  consumptionInstant: number; // Consumo en tiempo real (L/s)
}