import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-session-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-info.html',
})
export class SessionInfo implements OnInit {
  // Mock de datos inicial basado en tu imagen
  session: any = {
    type: 'RACE',
    trackName: 'Autodromo Nazionale Monza',
    layout: 'Grand Prix',
    length: '5.793 Km',
    timeRemaining: '00:44:12',
    lapsRemaining: 18,
    estimatedTotalLaps: 24,
    sessionProgress: 25, // Ejemplo: un cuarto de carrera completado
    airTemp: 22.4,
    airTempDelta: '+0.2',
    trackTemp: 34.1,
    trackTempDelta: '-1.2',
    rainChance: 12,
    rainStatus: 'Decreasing',
    isConnected: true,
  };

  ngOnInit(): void {
    // Aquí es donde más adelante nos conectaremos al servicio de Electron
  }
}
