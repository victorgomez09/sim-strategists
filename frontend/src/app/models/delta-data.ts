export interface DeltaData {
  currentDelta: number;     // Ej: -0.125 o +0.050
  bestLap: string;          // Ej: "1:42.503"
  deltaType: 'vpb' | 'vbl'; // Virtual Personal Best / Virtual Best Lap
  barPercentage: number;    // 0 a 100 para el ancho de la barra (mapeado de -1s a +1s)
}