import { Injectable, NgZone, signal } from '@angular/core';
import { LMU_Snapshot } from '../models/shared-memory';
import { getLMUMockData } from '../mock/lmu';

@Injectable({
  providedIn: 'root',
})
export class SharedMemory {
  public data = signal<LMU_Snapshot | null>(null);
  private readonly isDevMode = true; // Cambia a false cuando quieras datos reales

  constructor(private readonly ngZone: NgZone) {
    if (this.isDevMode) {
      this.startMock();
    } else {
      this.listenToElectron();
    }
  }

  private listenToElectron() {
    (globalThis as any).electronAPI?.onTelemetryUpdate((snapshot: LMU_Snapshot) => {
      console.log("Received snapshot", snapshot);
      this.ngZone.run(() => this.data.set(snapshot));
    });
  }

  private startMock() {
    // Simulamos una actualización a 10Hz (cada 100ms)
    setInterval(() => {
      const mockData = getLMUMockData();
      console.log("Mock data", mockData);
      this.data.set(mockData);
    }, 100);
  }
}
