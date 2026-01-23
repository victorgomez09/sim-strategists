import { BrowserWindow } from "electron";
import * as fs from "node:fs";

let isConnected = false;
const SCORING_FILE = "\\\\.\\mailslot\\$rFactor2SMMP_Scoring$";

export function startTelemetryLoop(mainWindow: BrowserWindow | null) {
  setInterval(() => {
    if (!mainWindow) return;

    try {
      // Leemos el buffer de Scoring
      const buffer = fs.readFileSync(SCORING_FILE);

      if (buffer && buffer.length > 0) {
        if (!isConnected) {
          isConnected = true;
          mainWindow.webContents.send("connection-status", true);
        }

        // --- PARSING DE SESSION INFO (Offsets oficiales rF2/LMU) ---
        const sessionData = {
          type: getSessionType(buffer.readInt32LE(140)),
          trackName: buffer.slice(64, 128).toString().replace(/\0/g, "").trim(),
          layout: buffer.slice(128, 192).toString().replace(/\0/g, "").trim(),

          // Cambiamos readFloat64LE por readDoubleLE
          length: (buffer.readDoubleLE(48) / 1000).toFixed(2) + " km",
          airTemp: Math.round(buffer.readDoubleLE(176)),
          trackTemp: Math.round(buffer.readDoubleLE(168)),
          rainChance: Math.round(buffer.readDoubleLE(184) * 100),

          lapsRemaining: buffer.readInt32LE(160),
          timeRemainingSeconds: buffer.readDoubleLE(152),

          isTimedRace: buffer.readInt8(144) === 1,
          sessionProgress: calculateProgress(buffer),
        };
        mainWindow.webContents.send("session-update", sessionData);
      }
    } catch (e) {
      if (isConnected) {
        isConnected = false;
        mainWindow.webContents.send("connection-status", false);
        // Enviamos un evento de "limpieza" a Angular
        mainWindow.webContents.send("session-update", null);
      }
    }
  }, 500); // 2Hz es suficiente para info de sesión
}

// Helpers
function getSessionType(type: number): string {
  const types = ["PRACTICE", "QUALIFY", "RACE", "WARMUP"];
  return types[type] || "UNKNOWN";
}

function calculateProgress(buffer: Buffer): number {
  try {
    const isTimedRace = buffer.readInt8(144) === 1;
    let progress = 0;

    if (isTimedRace) {
      // Carrera por TIEMPO
      const totalTime = buffer.readDoubleLE(144 + 4); // mMaxSeconds (Offset aproximado 148)
      const timeRemaining = buffer.readDoubleLE(152); // mEndTime

      if (totalTime > 0) {
        // Progreso = (Tiempo Total - Tiempo Restante) / Tiempo Total
        progress = ((totalTime - timeRemaining) / totalTime) * 100;
      }
    } else {
      // Carrera por VUELTAS
      const totalLaps = buffer.readInt32LE(160 + 4); // mMaxLaps (Offset aproximado 164)
      // Necesitamos la vuelta del líder (primer coche en el buffer)
      const leaderLaps = buffer.readInt32LE(700 + 40); // mLaps del primer vehículo

      if (totalLaps > 0) {
        progress = (leaderLaps / totalLaps) * 100;
      }
    }

    // Normalizar entre 0 y 100
    return Math.max(0, Math.min(100, progress));
  } catch (e) {
    return 0;
  }
}
