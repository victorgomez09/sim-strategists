import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-input-efficiency',
  imports: [CommonModule],
  templateUrl: './input-efficiency.html',
  styleUrl: './input-efficiency.css',
})
export class InputEfficiency {
  // Datos simulados de alta frecuencia (Shared Memory)
  throttle = signal(85);
  brake = signal(0);
  clutch = signal(0);

  // Stats de eficiencia de la última vuelta
  lastLapCoasting = signal(4.2); // Segundos que estuvimos en "coasting"
  targetCoasting = signal(5.5); // Objetivo del ingeniero para ahorrar combustible

  // Cálculo de la barra de eficiencia (0-100%)
  // Si el coasting es mayor o igual al target, eficiencia es 100%
  efficiencyLevel = computed(() => {
    return Math.min((this.lastLapCoasting() / this.targetCoasting()) * 100, 100);
  });

  getEffColor(val: number): string {
    if (val > 90) return 'text-success';
    if (val > 70) return 'text-warning';
    return 'text-error';
  }
}
