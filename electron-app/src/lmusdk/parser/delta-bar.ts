import * as fs from "node:fs";

const OFFSETS = {
  // Telemetry Buffer
  TIME_CURRENT_LAP: 3228,   // mCurrentET (Double)
  SPLIT_TIME: 3240,         // mSplitTime (Double) - El Delta real vs Best Lap
  
  // Scoring Buffer (para saber cuál es tu mejor vuelta actual)
  BEST_LAP_TIME: 700 + 48,  // mBestLapTime (Double) del primer vehículo (tú)
};

export function startDeltaLoop(mainWindow: any) {
  setInterval(() => {
    try {
      const telBuffer = fs.readFileSync('\\\\.\\mailslot\\$rFactor2SMMP_Telemetry$');
      const scoBuffer = fs.readFileSync('\\\\.\\mailslot\\$rFactor2SMMP_Scoring$');

      // 1. Obtener el delta crudo (ej: -0.125)
      const currentDelta = telBuffer.readDoubleLE(OFFSETS.SPLIT_TIME);

      // 2. Obtener el tiempo de la mejor vuelta para mostrarlo en el componente
      const bestLapSeconds = scoBuffer.readDoubleLE(OFFSETS.BEST_LAP_TIME);
      
      // 3. Calcular el porcentaje para la barra (mapeado de -1s a +1s)
      // El centro (0.0s) es el 50%.
      // Cada 0.1s de diferencia equivale a un 5% de la barra.
      let barPercentage = 50 + (currentDelta * 50);
      
      // Limitar entre 0 y 100 para no romper el CSS
      barPercentage = Math.max(0, Math.min(100, barPercentage));

      const deltaData = {
        currentDelta: currentDelta,
        bestLap: formatLapTime(bestLapSeconds),
        deltaType: 'vbl', // Virtual Best Lap
        barPercentage: barPercentage
      };

      mainWindow.webContents.send('delta-update', deltaData);
    } catch (e) {
      // Si el buffer no está disponible, enviamos un delta neutro
    }
  }, 16); // 60 FPS para máxima suavidad
}

function formatLapTime(seconds: number): string {
  if (seconds <= 0) return "--:--.---";
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(3);
  return `${m}:${s.padStart(6, '0')}`;
}