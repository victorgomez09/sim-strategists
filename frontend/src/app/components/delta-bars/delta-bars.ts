import { CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { LMU_Relative } from '../../models/shared-memory';

@Component({
  selector: 'app-delta-bars',
  imports: [CommonModule],
  templateUrl: './delta-bars.html',
  styleUrl: './delta-bars.css',
})
export class DeltaBars {
  relative = input<LMU_Relative>();

  get delta(): number {
    return parseFloat(this.relative()?.delta || '0');
  }

  get bestLap(): string {
    return this.relative()?.bestLap || '--:--.---';
  }

  get barWidth(): string {
    // Limitamos el delta a un máximo de 1 segundo para el cálculo visual
    const absDelta = Math.min(Math.abs(this.delta), 1.0);
    return absDelta * 100 + '%';
  }

  get deltaColorClass(): string {
    if (this.delta < 0) return 'text-success'; // Ganando tiempo (Verde)
    if (this.delta > 0) return 'text-error'; // Perdiendo tiempo (Rojo)
    return 'text-white';
  }

  get barColorClass(): string {
    return this.delta <= 0
      ? 'bg-success shadow-[0_0_15px_#1fb271]'
      : 'bg-error shadow-[0_0_15px_#f87272]';
  }
}
