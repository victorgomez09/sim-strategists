import { LMUConnector } from "./lmu-connector";

const connector = new LMUConnector();

// Persistencia para cálculos de combustible y temperatura
let tempHistory = { air: [] as number[], track: [] as number[] };
let fuelState = {
  lastLapCount: -1,
  fuelAtLapStart: -1,
  averageConsumption: 0,
  lapsCounted: 0,
};
let bestLapMap: { dist: number; time: number }[] = [];
let currentLapStartTime = 0;
let lastBestLapTime = -1;

function calculateLiveDelta(
  currentDist: number,
  currentET: number,
  bestLapTime: number,
) {
  // Si el simulador nos dice que hay un nuevo Best Lap, reseteamos el mapa (se llenará en la siguiente vuelta)
  if (bestLapTime > 0 && bestLapTime !== lastBestLapTime) {
    lastBestLapTime = bestLapTime;
    // Nota: En una implementación pro, aquí guardaríamos el histórico de la vuelta anterior
    // como referencia. Por ahora, limpiamos para recalcular.
    bestLapMap = [];
  }

  // Si no tenemos referencia de la mejor vuelta, no hay delta
  if (bestLapMap.length === 0) {
    // Lógica simple: vamos guardando los puntos de la vuelta actual
    // para que en la siguiente sesión/vuelta sirvan de base.
    return "+0.00";
  }

  // Buscar el punto más cercano en la mejor vuelta a nuestra distancia actual
  const referencePoint = bestLapMap.reduce((prev, curr) => {
    return Math.abs(curr.dist - currentDist) < Math.abs(prev.dist - currentDist)
      ? curr
      : prev;
  });

  const currentLapTime = currentET - currentLapStartTime;
  const delta = currentLapTime - referencePoint.time;

  return (delta >= 0 ? "+" : "") + delta.toFixed(2);
}

function calculateFuelStrategy(
  currentFuel: number,
  completedLaps: number,
  remainingSeconds: number,
  lastLapTime: number,
) {
  // Si detectamos una nueva vuelta completada
  if (completedLaps > fuelState.lastLapCount && completedLaps > 0) {
    if (fuelState.fuelAtLapStart !== -1) {
      const consumedThisLap = fuelState.fuelAtLapStart - currentFuel;
      if (consumedThisLap > 0) {
        // Media móvil simple para suavizar el consumo
        fuelState.averageConsumption =
          (fuelState.averageConsumption * fuelState.lapsCounted +
            consumedThisLap) /
          (fuelState.lapsCounted + 1);
        fuelState.lapsCounted++;
      }
    }
    fuelState.fuelAtLapStart = currentFuel;
    fuelState.lastLapCount = completedLaps;
  }

  const lapsRemainingByFuel =
    fuelState.averageConsumption > 0
      ? currentFuel / fuelState.averageConsumption
      : 0;

  // Calcular cuántas vueltas quedan de sesión
  let lapsRemainingByTime = 0;
  if (lastLapTime > 0 && remainingSeconds > 0) {
    lapsRemainingByTime = remainingSeconds / lastLapTime;
  }

  return {
    avgConsumption: fuelState.averageConsumption.toFixed(2),
    lapsRemaining: lapsRemainingByFuel.toFixed(1),
    fuelDeltaLaps: (lapsRemainingByFuel - lapsRemainingByTime).toFixed(1), // Positivo = Sobra, Negativo = Falta
    needsRefuel: lapsRemainingByFuel < lapsRemainingByTime,
  };
}

function calculateDelta(current: number, type: "air" | "track"): string {
  const history = type === "air" ? tempHistory.air : tempHistory.track;
  history.push(current);
  if (history.length > 60) history.shift(); // 30 segundos de histórico a 2Hz
  const diff = current - (history[0] || current);
  return (diff >= 0 ? "+" : "") + diff.toFixed(1);
}

const participantsState = new Map<string, {
    startPos: number;
    lastPitLap: number;
    pitCount: number;
    tyreAge: number;
}>();

export function getFullSnapshot() {
    const sco = connector.getScoringData();
    const tel = connector.getTelemetryData();
    const rul = connector.getRulesData();
    const ext = connector.getExtendedData();

    if (!sco || !tel) return null;

    const remainingSeconds = Math.max(0, sco.endET - sco.currentET);
    const playerID = tel.mID;

    // Procesar cada vehículo para el Leaderboard Extendido
    const leaderboard = sco.vehicles.map((v) => {
        // Inicializar estado persistente si es nuevo
        if (!participantsState.has(v.mDriverName)) {
            participantsState.set(v.mDriverName, {
                startPos: v.mRank,
                lastPitLap: 0,
                pitCount: v.mNumPitstops,
                tyreAge: v.mTotalLaps
            });
        }
        const state = participantsState.get(v.mDriverName)!;

        // Lógica de Pit Stops y Edad de Neumático
        if (v.mNumPitstops > state.pitCount) {
            state.lastPitLap = v.mTotalLaps;
            state.tyreAge = 0;
            state.pitCount = v.mNumPitstops;
        } else {
            state.tyreAge = v.mTotalLaps - state.lastPitLap;
        }

        // Lógica de colores de sectores
        const calcSectorColor = (val: number, personalBest: number, sessionBest: number) => {
            if (val <= 0) return 'yellow';
            if (val <= sessionBest) return 'purple';
            if (val <= personalBest) return 'green';
            return 'yellow';
        };

        const lastS3 = v.mLastLapTime - (v.mLastS1 + v.mLastS2);
        const bestS3 = v.mBestLapTime - (v.mBestS1 + v.mBestS2);

        // Determinar clase por nombre de vehículo
        const carNameUpper = v.mVehicleName.toUpperCase();
        const carClass = carNameUpper.includes("GT3") ? "GT3" : 
                         carNameUpper.includes("ORECA") ? "LMP2" : "HYPERCAR";

        return {
            position: v.mRank,
            classPosition: 0, // Se calcula después
            driverName: v.mDriverName,
            carName: v.mVehicleName,
            class: carClass,
            laps: v.mTotalLaps,
            gapToLeader: v.mRank === 1 ? "LEADER" : `+${v.mTimeBehindLeader.toFixed(1)}s`,
            gapToAhead: `+${v.mTimeBehindNext.toFixed(1)}s`,
            lastLap: formatLapTime(v.mLastLapTime),
            bestLap: formatLapTime(v.mBestLapTime),
            lastLapRaw: v.mLastLapTime,
            bestLapRaw: v.mBestLapTime,
            isPlayer: v.mID === playerID,
            inPits: v.mInPits,
            pitStopCount: v.mNumPitstops,
            lastPitLap: state.lastPitLap,
            tyreAge: state.tyreAge,
            tyreCompound: "Medium", // Mapeo simplificado
            positionChange: state.startPos - v.mRank,
            isFastestLap: v.mBestLapTime <= sco.sessionBestLap && v.mBestLapTime > 0,
            sectors: {
                s1: calcSectorColor(v.mLastS1, v.mBestS1, sco.sessionBestS1),
                s2: calcSectorColor(v.mLastS2, v.mBestS2, sco.sessionBestS2),
                s3: calcSectorColor(lastS3, bestS3, sco.sessionBestS3),
            }
        };
    }).sort((a, b) => a.position - b.position);

    // Calcular posición de clase
    leaderboard.forEach(entry => {
        entry.classPosition = leaderboard.filter(e => e.class === entry.class && e.position <= entry.position).length;
    });

    const playerEntry = leaderboard.find(e => e.isPlayer);

    return {
        session: {
            track: sco.trackName,
            type: ["PRACTICE", "PRACTICE", "QUALIFY", "WARMUP", "RACE"][sco.session] || "PRACTICE",
            timeRemaining: remainingSeconds,
            sessionProgress: sco.endET > 0 ? Math.round((sco.currentET / sco.endET) * 100) : 0,
            airTemp: Math.round(sco.ambientTemp),
            airTempDelta: calculateDelta(sco.ambientTemp, "air"),
            trackTemp: Math.round(sco.trackTemp),
            trackTempDelta: calculateDelta(sco.trackTemp, "track"),
            rain: Math.round(sco.rainIntensity * 100),
            flag: ["GREEN", "YELLOW", "BLUE", "RED"][rul?.trackFlag || 0] || "GREEN",
            sectorFlags: rul?.sectorFlags || [0, 0, 0],
        },
        car: {
            speed: Math.round(tel.speed),
            gear: tel.gear === 0 ? "N" : tel.gear === -1 ? "R" : tel.gear.toString(),
            rpm: Math.round(tel.rpm),
            fuel: tel.fuel.toFixed(2),
            fuelCapacity: tel.fuelCapacity,
            fuelStrategy: calculateFuelStrategy(tel.fuel, playerEntry?.laps || 0, remainingSeconds, playerEntry?.lastLapRaw || 0),
            inPits: ext?.isPlayerInPit || false,
            tyreTemps: tel.tyreTemps,
            tyreWear: tel.tyreWear.map(w => Math.round(w * 100)),
            brakeTemps: tel.brakeTemps.map(t => Math.round(t)),
        },
        leaderboard,
        relative: {
            position: playerEntry?.position || 0,
            delta: calculateLiveDelta(ext.lapDistance, sco.currentET, playerEntry?.bestLapRaw || 0),
            bestLap: playerEntry?.bestLap || "--:--.---",
            ahead: leaderboard[leaderboard.findIndex(e => e.isPlayer) - 1],
            behind: leaderboard[leaderboard.findIndex(e => e.isPlayer) + 1],
        }
    };
}

function formatLapTime(time: number): string {
    if (time <= 0 || time > 999) return "--:--.---";
    const mins = Math.floor(time / 60);
    const secs = (time % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, "0")}`;
}
