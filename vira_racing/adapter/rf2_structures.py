import ctypes

# El plugin de rF2 usa alineación de 4 bytes
class rF2VehicleTelemetry(ctypes.Structure):
    _pack_ = 4
    _fields_ = [
        ("mID", ctypes.c_int32),                      # 0
        ("mDeltaTime", ctypes.c_double),              # 4
        ("mElapsedTime", ctypes.c_double),            # 12
        ("mLapNumber", ctypes.c_int32),               # 20
        ("mLapStartET", ctypes.c_double),             # 24
        ("mVehicleName", ctypes.c_char * 64),         # 32
        ("mPos", ctypes.c_double * 3),                # 96
        ("mLocalVel", ctypes.c_double * 3),           # 120
        ("mLocalAccel", ctypes.c_double * 3),         # 144
        ("mOri", ctypes.c_double * 3),                # 168
        ("mLocalRot", ctypes.c_double * 3),           # 192
        ("mLocalRotAccel", ctypes.c_double * 3),      # 216
        ("mGear", ctypes.c_int32),                    # 240
        ("mEngineRPM", ctypes.c_double),              # 244
        ("mEngineWaterTemp", ctypes.c_double),        # 252
        ("mEngineOilTemp", ctypes.c_double),          # 260
        ("mClutchRPM", ctypes.c_double),              # 268
        ("mUnused", ctypes.c_double),                 # 276
        ("mFuel", ctypes.c_double),                   # 284 <-- AQUÍ ESTÁ EL DATO
        # ... hay más campos pero cortamos aquí para asegurar el offset
    ]

class rF2Telemetry(ctypes.Structure):
    _pack_ = 4
    _fields_ = [
        ("mNumVehicles", ctypes.c_int32),
        ("mVehicles", rF2VehicleTelemetry * 128),
    ]

# Estructura de Scoring (Simplificada pero con offsets correctos)
class rF2VehicleScoring(ctypes.Structure):
    _pack_ = 4
    _fields_ = [
        ("mID", ctypes.c_int32),
        ("mIsPlayer", ctypes.c_int8),
        ("mPlace", ctypes.c_int8),
        ("mReserved", ctypes.c_int16),
        ("mNumLaps", ctypes.c_int32),
        ("mTotalLaps", ctypes.c_int32),
        ("mLastLapTime", ctypes.c_double),
        ("mBestLapTime", ctypes.c_double),
    ]

class rF2Scoring(ctypes.Structure):
    _pack_ = 4
    _fields_ = [
        ("mSession", ctypes.c_int32),
        ("mCurrentET", ctypes.c_double),
        ("mEndET", ctypes.c_double),
        ("mNumVehicles", ctypes.c_int32),
        ("mVehicles", rF2VehicleScoring * 128),
    ]