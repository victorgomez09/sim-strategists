import { computed, Injectable, signal } from '@angular/core';
import { SessionInfo } from '../models/session-info';

@Injectable({
  providedIn: 'root',
})
export class SessionInfoService {
  private readonly rawSession = signal<any>(null);

  session = computed<SessionInfo>(() => {
    const data = this.rawSession();
    if (!data) return this.getEmptySession();

    return {
      ...data,
      timeRemaining: this.formatSeconds(data.timeRemainingSeconds),
    };
  });

  constructor() {
    (window as any).lmuAPI?.onSessionUpdate((data: any) => {
      this.rawSession.set(data);
    });
  }

  private formatSeconds(s: number): string {
    if (s < 0) return '--:--';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  private getEmptySession(): SessionInfo {
    return {
      type: 'OFFLINE',
      trackName: 'Waiting for LMU...',
      layout: '---',
      length: '0 km',
      airTemp: 0,
      trackTemp: 0,
      rainChance: 0,
      lapsRemaining: 0,
      timeRemaining: '--:--',
      isTimedRace: false,
      sessionProgress: 0,
      airTempDelta: '',
      trackTempDelta: '',
      rainStatus: '',
      estimatedTotalLaps: 0,
    };
  }
}
