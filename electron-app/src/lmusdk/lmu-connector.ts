import koffi from "koffi";
import { LeaderboardEntry } from "./types/lmu-shared";

const FILE_MAP_READ = 0x0004;
const kernel32 = koffi.load("kernel32.dll");
const OpenFileMappingA = kernel32.func("void* __stdcall OpenFileMappingA(uint32_t, int, string)");
const MapViewOfFile = kernel32.func("void* __stdcall MapViewOfFile(void*, uint32_t, uint32_t, uint32_t, size_t)");

export class LMUConnector {
  private readonly pointers: any = { sco: null, tel: null, rul: null, ext: null };

  constructor() {
    this.init();
  }

  private init() {
    this.pointers.sco = MapViewOfFile(OpenFileMappingA(FILE_MAP_READ, 0, "$rFactor2SMMP_Scoring$"), FILE_MAP_READ, 0, 0, 0);
    this.pointers.tel = MapViewOfFile(OpenFileMappingA(FILE_MAP_READ, 0, "$rFactor2SMMP_Telemetry$"), FILE_MAP_READ, 0, 0, 0);
    this.pointers.rul = MapViewOfFile(OpenFileMappingA(FILE_MAP_READ, 0, "$rFactor2SMMP_Rules$"), FILE_MAP_READ, 0, 0, 0);
    this.pointers.ext = MapViewOfFile(OpenFileMappingA(FILE_MAP_READ, 0, "$rFactor2SMMP_Extended$"), FILE_MAP_READ, 0, 0, 0);
  }

  // --- SCORING: Datos de sesión y competidores ---
  public getScoringData() {
    if (!this.pointers.sco) return null;
    const buf = Buffer.from(koffi.decode(this.pointers.sco, "uint8_t", 65536) as Uint8Array);

    const numVehicles = buf.readInt32LE(708);
    const vehicles = [];
    const VEHICLE_STRUCT_SIZE = 624;

    for (let i = 0; i < Math.min(numVehicles, 64); i++) {
      const offset = 712 + i * VEHICLE_STRUCT_SIZE;
      vehicles.push({
        mID: buf.readInt32LE(offset),
        mRank: buf.readInt8(offset + 4),
        mTotalLaps: buf.readInt32LE(offset + 32),
        mLastLapTime: buf.readDoubleLE(offset + 152),
        mBestLapTime: buf.readDoubleLE(offset + 160),
        mDriverName: buf.slice(offset + 212, offset + 276).toString("utf8").split("\0")[0].trim(),
        mVehicleName: buf.slice(offset + 276, offset + 340).toString("utf8").split("\0")[0].trim(),
        mInPits: buf.readInt8(offset + 384) === 1,
        mTimeBehindLeader: buf.readDoubleLE(offset + 368),
      });
    }

    return {
      trackName: buf.slice(8, 72).toString("utf8").split("\0")[0].trim(),
      session: buf.readInt32LE(136),
      currentET: buf.readDoubleLE(12),
      endET: buf.readDoubleLE(152),
      ambientTemp: buf.readDoubleLE(240),
      trackTemp: buf.readDoubleLE(248),
      rainIntensity: buf.readDoubleLE(256),
      numVehicles,
      vehicles,
    };
  }

  // --- TELEMETRY: Tu coche (Física) ---
  public getTelemetryData() {
    if (!this.pointers.tel) return null;
    const buf = Buffer.from(koffi.decode(this.pointers.tel, "uint8_t", 32768) as Uint8Array);

    return {
      mID: buf.readInt32LE(8), 
      gear: buf.readInt32LE(140),
      rpm: buf.readDoubleLE(144),
      fuel: buf.readDoubleLE(224),
      fuelCapacity: buf.readDoubleLE(232),
      speed: Math.sqrt(Math.pow(buf.readDoubleLE(56), 2) + Math.pow(buf.readDoubleLE(72), 2)) * 3.6,
      tyreTemps: {
        fl: buf.readDoubleLE(400), fr: buf.readDoubleLE(408),
        rl: buf.readDoubleLE(416), rr: buf.readDoubleLE(424),
      },
      tyreWear: [buf.readDoubleLE(448), buf.readDoubleLE(456), buf.readDoubleLE(464), buf.readDoubleLE(472)],
      brakeTemps: [buf.readDoubleLE(280), buf.readDoubleLE(288), buf.readDoubleLE(296), buf.readDoubleLE(304)],
    };
  }

  // --- RULES: Banderas y Estado de Pista ---
  public getRulesData() {
    if (!this.pointers.rul) return null;
    const buf = Buffer.from(koffi.decode(this.pointers.rul, "uint8_t", 16384) as Uint8Array);
    return {
      trackFlag: buf.readInt32LE(12), // 0: Green, 1: Yellow, 2: Blue, 3: Red
      sectorFlags: [buf.readInt8(20), buf.readInt8(21), buf.readInt8(22)],
      pitState: buf.readInt32LE(28), // Estado del carril de boxes
    };
  }

  // --- EXTENDED: Datos Adicionales (Electrónica/Pit) ---
  public getExtendedData() {
    if (!this.pointers.ext) return null;
    const buf = Buffer.from(koffi.decode(this.pointers.ext, "uint8_t", 16384) as Uint8Array);
    return {
      isPlayerInPit: buf.readInt8(20) === 1,
      lapDistance: buf.readDoubleLE(40),
      maxPathNodes: buf.readInt32LE(24),
      visualFilteredRPM: buf.readDoubleLE(104), // Útil para luces de revoluciones estables
    };
  }

  // --- LEADERBOARD: Clasificación procesada ---
  public getLeaderboard(): LeaderboardEntry[] {
    const scoring = this.getScoringData();
    const telemetry = this.getTelemetryData();

    if (!scoring || !scoring.vehicles.length) return [];

    const playerID = telemetry ? telemetry.mID : -1;
    const sortedVehicles = [...scoring.vehicles].sort((a, b) => a.mRank - b.mRank);

    return sortedVehicles.map((v, index) => {
      let gapToAhead = "---";
      if (index > 0) {
        const diff = v.mTimeBehindLeader - sortedVehicles[index - 1].mTimeBehindLeader;
        gapToAhead = diff > 0 ? `+${diff.toFixed(1)}s` : "---";
      }

      return {
        position: v.mRank,
        driverName: v.mDriverName,
        carName: v.mVehicleName,
        gapToLeader: v.mRank === 1 ? "LEADER" : `+${v.mTimeBehindLeader.toFixed(1)}s`,
        gapToAhead: gapToAhead,
        lastLap: this.formatLapTime(v.mLastLapTime),
        bestLap: this.formatLapTime(v.mBestLapTime),
        isPlayer: v.mID === playerID,
        inPits: v.mInPits,
      };
    });
  }

  private formatLapTime(time: number): string {
    if (time <= 0 || time > 999) return "--:--.---";
    const mins = Math.floor(time / 60);
    const secs = (time % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, "0")}`;
  }
}