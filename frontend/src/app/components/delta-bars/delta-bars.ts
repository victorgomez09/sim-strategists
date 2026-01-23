import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-delta-bars',
  imports: [CommonModule],
  templateUrl: './delta-bars.html',
  styleUrl: './delta-bars.css',
})
export class DeltaBars {
  @Input() delta: number = -0.128;
  @Input() bestLap: string = '1:42.503';

  // Calculamos el color y el ancho
  get deltaColorClass(): string {
    return this.delta <= 0 ? 'text-success' : 'text-error';
  }

  get barColorClass(): string {
    return this.delta <= 0
      ? 'bg-success shadow-[0_0_15px_rgba(34,197,94,0.6)]'
      : 'bg-error shadow-[0_0_15px_rgba(239,68,68,0.6)]';
  }

  // Mapeamos el delta (-1.0s a +1.0s) a porcentaje (0% a 50%) para cada lado
  get barWidth(): string {
    const limit = 1.0; // El límite visual de la barra es 1 segundo
    const absDelta = Math.min(Math.abs(this.delta), limit);
    return (absDelta / limit) * 50 + '%';
  }
}
