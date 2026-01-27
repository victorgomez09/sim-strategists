import { LMU_Snapshot } from "../models/shared-memory";

export const getLMUMockData = (): LMU_Snapshot => {
  const now = new Date();
  const rpmBase = 5000 + Math.random() * 3000;

  return {
    session: {
      track: "Circuit de la Sarthe",
      type: "PRACTICE",
      timeRemaining: 3605,
      sessionProgress: 15,
      airTemp: 24,
      airTempDelta: "+0.2",
      trackTemp: 32,
      trackTempDelta: "-0.1",
      rain: 5,
      flag: 'GREEN',
      sectorFlags: [0, 0, 0]
    },
    car: {
      speed: Math.floor(240 + Math.random() * 20),
      gear: "5",
      rpm: Math.floor(rpmBase),
      fuel: (45.5 - (now.getSeconds() * 0.01)).toFixed(2),
      fuelCapacity: 100,
      fuelStrategy: {
        avgConsumption: "3.45",
        lapsRemaining: "13.2",
        fuelDeltaLaps: "+1.5",
        needsRefuel: false
      },
      inPits: false,
      tyreTemps: {
        fl: 92, fr: 94, rl: 88, rr: 89
      },
      tyreWear: [98, 97, 99, 99],
      brakeTemps: [450, 462, 380, 385]
    },
    leaderboard: [
      { position: 1, driverName: "Max Verstappen", carName: "Hypercar", gapToLeader: "LEADER", gapToAhead: "---", lastLap: "3:24.500", bestLap: "3:24.100", isPlayer: false, inPits: false },
      { position: 2, driverName: "Tu Nombre (Player)", carName: "Hypercar", gapToLeader: "+1.2s", gapToAhead: "+1.2s", lastLap: "3:25.100", bestLap: "3:24.900", isPlayer: true, inPits: false },
      { position: 3, driverName: "Charles Leclerc", carName: "Hypercar", gapToLeader: "+2.5s", gapToAhead: "+1.3s", lastLap: "3:25.800", bestLap: "3:25.000", isPlayer: false, inPits: false }
    ]
  };
};