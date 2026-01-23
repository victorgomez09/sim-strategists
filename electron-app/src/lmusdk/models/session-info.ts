export interface SessionInfo {
  type: string;
  trackName: string;
  layout: string;
  length: string;
  airTemp: number;
  airTempDelta: string;
  trackTemp: number;
  trackTempDelta: string;
  rainChance: number;
  rainStatus: string;
  lapsRemaining: number;
  timeRemaining: string;
  isTimedRace: boolean;
  estimatedTotalLaps: number;
  sessionProgress: number;
}