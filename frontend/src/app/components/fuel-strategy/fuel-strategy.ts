import { Component, computed, signal } from '@angular/core';
import { FuelData } from '../../models/fuel-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fuel-strategy',
  imports: [CommonModule],
  templateUrl: './fuel-strategy.html',
  styleUrl: './fuel-strategy.css',
})
export class FuelStrategy {
  // Datos reactivos (Signals)
  fuel = signal<FuelData>({
    currentFuel: 45.5,
    virtualEnergy: 62,
    avgConsumption: 3.85,
    lapsRemainingOnFuel: 11.8,
    fuelRequiredToEnd: 58.2,
    fuelDelta: -12.7,
    extraLapsMargin: 2,
    isEnergyLimited: false,
  });

  // Lógica de colores basada en la wiki de SecondMonitor
  statusClass = computed(() => {
    const delta = this.fuel().fuelDelta;
    if (delta > 2) return 'text-success shadow-[0_0_10px_rgba(34,197,94,0.4)]'; // Sobra
    if (delta >= 0) return 'text-warning'; // Justo
    if (delta > -5) return 'text-error animate-pulse'; // No llegas
    return 'text-error font-black bg-error/10 px-2 rounded'; // Crítico
  });

  // Lógica para el Virtual Energy Tank (LMU)
  energyColor = computed(() => {
    const energy = this.fuel().virtualEnergy || 0;
    return energy < 15 ? 'text-error' : 'text-primary';
  });
}
