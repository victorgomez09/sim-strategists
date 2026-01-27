import { LMU_Snapshot } from '../models/shared-memory';

export const getLMUMockData = (): LMU_Snapshot => {
  const now = new Date();
  const rpmBase = 5000 + Math.random() * 3000;
  const mockDelta = (Math.random() * 0.4 - 0.2).toFixed(3);

  return {
    session: {
      track: 'Circuit de la Sarthe',
      type: 'RACE',
      timeRemaining: 14400,
      sessionProgress: 25,
      airTemp: 22,
      airTempDelta: '-0.1',
      trackTemp: 28,
      trackTempDelta: '-0.4',
      rain: 0,
      flag: 'GREEN',
      sectorFlags: [0, 0, 0],
    },
    car: {
      speed: Math.floor(285 + Math.random() * 15),
      gear: '6',
      rpm: Math.floor(rpmBase),
      fuel: (62.4 - now.getSeconds() * 0.05).toFixed(2),
      fuelCapacity: 100,
      fuelStrategy: {
        avgConsumption: '3.85',
        lapsRemaining: '16.2',
        fuelDeltaLaps: '+1.2',
        needsRefuel: false,
      },
      inPits: false,
      tyreTemps: { fl: 95, fr: 96, rl: 92, rr: 93 },
      tyreWear: [85, 84, 88, 87],
      brakeTemps: [520, 525, 480, 485],
    },
    leaderboard: [
      {
        position: 1,
        classPosition: 1,
        driverName: 'A. Pier Guidi',
        carName: 'Ferrari 499P',
        class: 'HYPERCAR',
        laps: 44, // <--- Añadido para cálculo de stint
        gapToLeader: 'LEADER',
        gapToAhead: '---',
        lastLap: '3:24.500',
        bestLap: '3:24.100',
        isPlayer: false,
        inPits: false,
        pitStopCount: 4,
        lastPitLap: 38, 
        tyreAge: 6,
        tyreCompound: 'Medium',
        positionChange: 2,
        isFastestLap: true,
        sectors: { s1: 'green', s2: 'purple', s3: 'green' }
      },
      {
        position: 2,
        classPosition: 2,
        driverName: 'Tu Nombre (Player)',
        carName: 'Porsche 963',
        class: 'HYPERCAR',
        laps: 44,
        gapToLeader: '+1.240',
        gapToAhead: '+1.240',
        lastLap: '3:25.100',
        bestLap: '3:24.900',
        isPlayer: true,
        inPits: false,
        pitStopCount: 4,
        lastPitLap: 36,
        tyreAge: 8,
        tyreCompound: 'Medium',
        positionChange: 0,
        isFastestLap: false,
        sectors: { s1: 'purple', s2: 'green', s3: 'yellow' }
      },
      {
        position: 3,
        classPosition: 3,
        driverName: 'K. Kobayashi',
        carName: 'Toyota GR010',
        class: 'HYPERCAR',
        laps: 44,
        gapToLeader: '+2.510',
        gapToAhead: '+1.270',
        lastLap: '3:28.800',
        bestLap: '3:25.000',
        isPlayer: false,
        inPits: true,
        pitStopCount: 5,
        lastPitLap: 44,
        tyreAge: 0,
        tyreCompound: 'Soft',
        positionChange: -2,
        isFastestLap: false,
        sectors: { s1: 'yellow', s2: 'yellow', s3: 'yellow' }
      },
      {
        position: 12,
        classPosition: 1,
        driverName: 'F. Albuquerque',
        carName: 'Oreca 07 LMP2',
        class: 'LMP2',
        laps: 42,
        gapToLeader: '+2 Laps',
        gapToAhead: '+15.400',
        lastLap: '3:35.200',
        bestLap: '3:34.800',
        isPlayer: false,
        inPits: false,
        pitStopCount: 4,
        lastPitLap: 24,
        tyreAge: 18,
        tyreCompound: 'Hard',
        positionChange: 3,
        isFastestLap: false,
        sectors: { s1: 'green', s2: 'green', s3: 'green' }
      }
    ],
    relative: {
      position: 2,
      delta: mockDelta,
      bestLap: '3:24.900',
      ahead: { driverName: 'A. Pier Guidi', gap: '-1.24s', isClassLeader: true },
      behind: { driverName: 'K. Kobayashi', gap: '+1.27s', isClassLeader: false }
    }
  };
};