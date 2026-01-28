import ctypes

MAX_VEHICLES = 128

class rF2Wheel(ctypes.Structure):
    _fields_ = [
        ("mSuspensionDeflection", ctypes.c_double),
        ("mRideHeight", ctypes.c_double),
        ("mLoad", ctypes.c_double),
        ("mTemperature", ctypes.c_double * 3),
        ("mWear", ctypes.c_double),
        ("mPressure", ctypes.c_double),
        ("mRotation", ctypes.c_double),
        ("mBrakeTemp", ctypes.c_double),
    ]

class rF2VehicleTelemetry(ctypes.Structure):
    _fields_ = [
        ("mID", ctypes.c_int32),
        ("mDeltaTime", ctypes.c_double),
        ("mElapsedTime", ctypes.c_double),
        ("mLapNumber", ctypes.c_int32),
        ("mPos", ctypes.c_double * 3),
        ("mLocalVel", ctypes.c_double * 3),
        ("mFuel", ctypes.c_double),
        ("mFuelCapacity", ctypes.c_double),
        ("mEngineRPM", ctypes.c_double),
        ("mGear", ctypes.c_int32),
        ("mWheels", rF2Wheel * 4),
    ]

class rF2Telemetry(ctypes.Structure):
    _fields_ = [
        ("mNumVehicles", ctypes.c_int32),
        ("mVehicles", rF2VehicleTelemetry * MAX_VEHICLES),
    ]

class rF2VehicleScoring(ctypes.Structure):
    _pack_ = 4
    _fields_ = [
        ("mID", ctypes.c_int32),            # ID único del vehículo
        ("mPlace", ctypes.c_int8),          # Posición en carrera (1-128)
        ("mIsPlayer", ctypes.c_int8),       # 1 si es el jugador, 0 si es IA/otro
        ("mNumLaps", ctypes.c_int32),       # Vueltas completadas
        ("mTotalLaps", ctypes.c_int32),     # Vueltas totales (incluyendo la actual)
        ("mLastLapTime", ctypes.c_double),  # Tiempo de la última vuelta (-1.0 si no hay)
        ("mBestLapTime", ctypes.c_double),  # Mejor vuelta personal
        ("mSector1", ctypes.c_double),      # Tiempo último sector 1
        ("mSector2", ctypes.c_double),      # Tiempo último sector 2
        ("mLapStartET", ctypes.c_double),   # Tiempo de sesión al iniciar la vuelta
        ("mInPits", ctypes.c_int8),         # 1 si está en boxes, 0 si no
        ("mNumPitstops", ctypes.c_int16),   # Número de paradas realizadas
        ("mPenalties", ctypes.c_int8),      # Penalizaciones pendientes
        ("mFinishStatus", ctypes.c_int8),   # 0: en carrera, 1: acabado, 2: DNF, 3: DQ
    ]

class rF2Scoring(ctypes.Structure):
    _pack_ = 4
    _fields_ = [
        # Información de Sesión
        ("mSession", ctypes.c_int32),       # 1: Práctica, 2: Qualy, 3: Carrera
        ("mCurrentET", ctypes.c_double),    # Tiempo transcurrido desde inicio sesión (segundos)
        ("mEndET", ctypes.c_double),        # Tiempo al que acaba la sesión (segundos)
        ("mMaxLaps", ctypes.c_int32),       # Vueltas máximas (si es carrera por vueltas)
        ("mLapDist", ctypes.c_double),      # Longitud del circuito (metros)
        
        # Información de Vehículos
        ("mNumVehicles", ctypes.c_int32),   # Cuántos coches hay en pista
        ("mVehicles", rF2VehicleScoring * MAX_VEHICLES),
    ]