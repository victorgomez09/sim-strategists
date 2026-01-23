import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeltaInfo {
  public delta = signal<any>({
    currentDelta: 0.0,
    bestLap: '--:--.---',
    deltaType: 'vbl',
    barPercentage: 50,
  });

  constructor() {
    (window as any).lmuAPI?.onDeltaUpdate((data: any) => {
      this.delta.set(data);
    });
  }
}
