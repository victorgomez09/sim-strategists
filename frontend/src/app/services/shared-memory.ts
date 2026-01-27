import { Injectable, NgZone, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedMemory {
  public data = signal<any>(null);

  constructor(private readonly ngZone: NgZone) {
    (globalThis as any).electronAPI.onTelemetryUpdate((snapshot: any) => {
      // NgZone.run no siempre es necesario con Signals, pero asegura la detección en Electron
      this.ngZone.run(() => {
        console.log("data received", snapshot)
        this.data.set(snapshot);
      });
    });
  }
}
