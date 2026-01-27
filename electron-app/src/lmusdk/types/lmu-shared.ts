export interface LMU_Vec3 {
    x: number; y: number; z: number;
}

export interface LMU_VehicleScoring {
    mID: number;
    mRank: number; // P1, P2...
    mPosition: LMU_Vec3;
    mTotalLaps: number;
    mSector: number;
    mFinishStatus: number;
    mLapDist: number;
    mPathSum: number;
    mLastLapTime: number;
    mBestLapTime: number;
    mSector1: number;
    mSector2: number;
    mSector3: number;
    mDriverName: string;
    mVehicleName: string;
    mTimeBehindNext: number;
    mLapsBehindNext: number;
    mTimeBehindLeader: number;
    mLapsBehindLeader: number;
    mInPits: boolean;
}

export interface LMU_Scoring {
    mTrackName: string;
    mSession: number;
    mCurrentET: number; // Tiempo transcurrido
    mEndET: number;     // Tiempo final
    mMaxLaps: number;
    mLapsRemaining: number;
    mAmbientTemp: number;
    mTrackTemp: number;
    mRainIntensity: number;
    mVehicles: LMU_VehicleScoring[];
}

export interface LMU_Telemetry {
    mTime: number;
    mLapNumber: number;
    mLapStartET: number;
    mVehiclePos: LMU_Vec3;
    mLocalVel: LMU_Vec3;
    mGear: number;
    mEngineRPM: number;
    mEngineWaterTemp: number;
    mEngineOilTemp: number;
    mClutchRPM: number;
    mFuel: number;
    mFuelCapacity: number;
    mBrakeTemp: number[]; // [FL, FR, RL, RR]
    mTyrePres: number[];  // [FL, FR, RL, RR]
    mTyreTemp: number[];  // [FL, FR, RL, RR]
    mTyreWear: number[];  // [FL, FR, RL, RR]
}

export interface LeaderboardEntry {
    position: number;
    driverName: string;
    carName: string;
    gapToLeader: string;
    gapToAhead: string;
    lastLap: string;
    bestLap: string;
    isPlayer: boolean;
    inPits: boolean;
}