import { LMUConnector } from "./lmu-connector";

const connector = new LMUConnector();

// Persistencia para cálculos de combustible y temperatura
let tempHistory = { air: [] as number[], track: [] as number[] };
let fuelState = {
    lastLapCount: -1,
    fuelAtLapStart: -1,
    averageConsumption: 0,
    lapsCounted: 0
};

function calculateFuelStrategy(currentFuel: number, completedLaps: number, remainingSeconds: number, lastLapTime: number) {
    // Si detectamos una nueva vuelta completada
    if (completedLaps > fuelState.lastLapCount && completedLaps > 0) {
        if (fuelState.fuelAtLapStart !== -1) {
            const consumedThisLap = fuelState.fuelAtLapStart - currentFuel;
            if (consumedThisLap > 0) {
                // Media móvil simple para suavizar el consumo
                fuelState.averageConsumption = (fuelState.averageConsumption * fuelState.lapsCounted + consumedThisLap) / (fuelState.lapsCounted + 1);
                fuelState.lapsCounted++;
            }
        }
        fuelState.fuelAtLapStart = currentFuel;
        fuelState.lastLapCount = completedLaps;
    }

    const lapsRemainingByFuel = fuelState.averageConsumption > 0 ? currentFuel / fuelState.averageConsumption : 0;
    
    // Calcular cuántas vueltas quedan de sesión
    let lapsRemainingByTime = 0;
    if (lastLapTime > 0 && remainingSeconds > 0) {
        lapsRemainingByTime = remainingSeconds / lastLapTime;
    }

    return {
        avgConsumption: fuelState.averageConsumption.toFixed(2),
        lapsRemaining: lapsRemainingByFuel.toFixed(1),
        fuelDeltaLaps: (lapsRemainingByFuel - lapsRemainingByTime).toFixed(1), // Positivo = Sobra, Negativo = Falta
        needsRefuel: lapsRemainingByFuel < lapsRemainingByTime
    };
}

function calculateDelta(current: number, type: 'air' | 'track'): string {
    const history = type === 'air' ? tempHistory.air : tempHistory.track;
    history.push(current);
    if (history.length > 60) history.shift(); // 30 segundos de histórico a 2Hz
    const diff = current - (history[0] || current);
    return (diff >= 0 ? "+" : "") + diff.toFixed(1);
}

export function getFullSnapshot() {
    const sco = connector.getScoringData();
    const tel = connector.getTelemetryData();
    const rul = connector.getRulesData();
    const ext = connector.getExtendedData();
    const leaderboard = connector.getLeaderboard();

    // Si no hay datos de sesión o telemetría, el simulador no está enviando datos
    if (!sco || !tel) return null;

    // 1. Cálculos de tiempo y progreso
    const remainingSeconds = Math.max(0, sco.endET - sco.currentET);
    const totalSessionTime = 3600; // Asumimos 1h por defecto si sco.endET es 0
    const progress = sco.endET > 0 
        ? Math.round((sco.currentET / sco.endET) * 100) 
        : Math.round((sco.currentET / totalSessionTime) * 100);

    // 2. Identificar datos del jugador para cálculos específicos
    const playerEntry = leaderboard.find(entry => entry.isPlayer);
    const lastLapTimeRaw = sco.vehicles.find(v => v.mID === tel.mID)?.mLastLapTime || 0;

    const fuelStrategy = calculateFuelStrategy(
        tel.fuel, 
        playerEntry?.position ? sco.vehicles.find(v => v.mID === tel.mID)?.mTotalLaps || 0 : 0,
        remainingSeconds,
        lastLapTimeRaw
    );

    return {
        session: {
            track: sco.trackName,
            type: ["PRACTICE", "PRACTICE", "QUALIFY", "WARMUP", "RACE"][sco.session] || "PRACTICE",
            timeRemaining: remainingSeconds,
            sessionProgress: Math.min(100, progress),
            airTemp: Math.round(sco.ambientTemp),
            airTempDelta: calculateDelta(sco.ambientTemp, 'air'),
            trackTemp: Math.round(sco.trackTemp),
            trackTempDelta: calculateDelta(sco.trackTemp, 'track'),
            rain: Math.round(sco.rainIntensity * 100),
            // Mapeo de banderas de Rules
            flag: ["GREEN", "YELLOW", "BLUE", "RED"][rul?.trackFlag || 0] || "GREEN",
            sectorFlags: rul?.sectorFlags || [0, 0, 0]
        },
        car: {
            speed: Math.round(tel.speed),
            gear: tel.gear === 0 ? "N" : (tel.gear === -1 ? "R" : tel.gear.toString()),
            rpm: Math.round(tel.rpm),
            fuel: tel.fuel.toFixed(2),
            fuelCapacity: tel.fuelCapacity,
            fuelStrategy: fuelStrategy,
            inPits: ext?.isPlayerInPit || false,
            tyreTemps: tel.tyreTemps,
            tyreWear: tel.tyreWear.map(w => Math.round(w * 100)), // Convertido a porcentaje de salud
            brakeTemps: tel.brakeTemps.map(t => Math.round(t))
        },
        // Usamos el leaderboard procesado por la clase (con gaps y formateo)
        leaderboard: leaderboard,
        // Relative simplificado (opcional: solo para vista rápida)
        relative: {
            position: playerEntry?.position || 0,
            gapAhead: playerEntry?.gapToAhead || "---",
            gapBehind: "---", // Se calcularía buscando al index + 1 en el leaderboard original
            lastLap: playerEntry?.lastLap || "--:--.---"
        }
    };
}