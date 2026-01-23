export interface WheelData {
  temp: {
    inner: number;
    middle: number;
    outer: number;
    core: number;
  };
  pressure: number;     // En kPa o PSI
  brakeTemp: number;    // Temperatura del disco
  wear: number;         // 0.0 a 100.0 (Vida restante)
  isLocking: boolean;   // Si está bloqueando neumático
}

export interface CarWheels {
  frontLeft: WheelData;
  frontRight: WheelData;
  rearLeft: WheelData;
  rearRight: WheelData;
}