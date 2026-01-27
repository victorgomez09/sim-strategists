export interface LMU_Snapshot {
  session: LMU_Session;
  car: LMU_Car;
  leaderboard: LMU_LeaderboardEntry[];
  relative: LMU_Relative;
}

export interface LMU_Session {
  track: string;             // Nombre del circuito (ej: "Le Mans")
  type: string;              // "PRACTICE", "QUALIFY", "RACE", etc.
  timeRemaining: number;     // Segundos restantes
  sessionProgress: number;   // Porcentaje (0-100)
  airTemp: number;           // Temperatura ambiente en ºC
  airTempDelta: string;      // Tendencia (ej: "+0.5")
  trackTemp: number;         // Temperatura pista en ºC
  trackTempDelta: string;    // Tendencia (ej: "-0.2")
  rain: number;              // Porcentaje de lluvia (0-100)
  flag: 'GREEN' | 'YELLOW' | 'BLUE' | 'RED';
  sectorFlags: number[];     // Estado de banderas por [S1, S2, S3]
}

export interface LMU_Car {
  speed: number;             // km/h
  gear: string;              // "R", "N", "1", "2"...
  rpm: number;               // Revoluciones por minuto
  fuel: string;              // Litros actuales (string para formato .toFixed(2))
  fuelCapacity: number;      // Capacidad máxima en litros
  fuelStrategy: LMU_FuelStrategy;
  inPits: boolean;           // ¿Está el jugador en el pit lane?
  tyreTemps: {
    fl: number;              // Front Left ºC
    fr: number;              // Front Right ºC
    rl: number;              // Rear Left ºC
    rr: number;              // Rear Right ºC
  };
  tyreWear: number[];        // Salud del neumático [FL, FR, RL, RR] en %
  brakeTemps: number[];      // Temperatura frenos [FL, FR, RL, RR] en ºC
}

export interface LMU_FuelStrategy {
  avgConsumption: string;    // Litros por vuelta (media móvil)
  lapsRemaining: string;     // Vueltas que se pueden dar con el fuel actual
  fuelDeltaLaps: string;     // Vueltas de diferencia respecto al final de carrera
  needsRefuel: boolean;      // True si el combustible no llega al final
}

type SectorStatus = 'purple' | 'green' | 'yellow' | 'none';

export interface LMU_LeaderboardEntry {
  position: number;          // Puesto en carrera (Rank)
  classPosition: number;
  class: string;
  driverName: string;
  carName: string;
  gapToLeader: string;       // "LEADER" o "+X.Xs"
  gapToAhead: string;        // Diferencia con el coche de delante
  lastLap: string;           // "MM:SS.ms"
  bestLap: string;           // "MM:SS.ms"
  isPlayer: boolean;         // ¿Es este vehículo el del usuario?
  inPits: boolean;           // ¿Está este piloto en boxes?
  pitStopCount: number;
  lastPitLap: number;       // En qué vuelta paró por última vez
  tyreAge: number;          // Vueltas que lleva con el neumático actual
  tyreCompound: string;
  laps: number;              // Vueltas completadas
  sectors: {
    s1: SectorStatus; s2: SectorStatus; s3: SectorStatus;
  };
  positionChange: number;   // Diferencia respecto a la salida (ej: +2, -1)
  isFastestLap: boolean;
}

export interface LMU_Relative {
  position: number;          // Posición actual en carrera
  delta: string;             // El Delta de tiempo real (ej: "-0.15" o "+0.32")
  bestLap: string;           // Tu mejor vuelta personal formateada
  
  // Datos de los pilotos cercanos (opcional pero muy útil para el HUD)
  ahead?: LMU_RelativeEntry;  
  behind?: LMU_RelativeEntry;
}

export interface LMU_RelativeEntry {
  driverName: string;
  gap: string;               // Tiempo respecto al jugador
  isClassLeader: boolean;    // Útil para saber si el que viene es de otra categoría
  color?: string;            // Color de la categoría (GTE, Hypercar, etc)
}