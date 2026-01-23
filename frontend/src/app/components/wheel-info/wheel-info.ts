import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarWheels } from '../../models/wheel-data';

@Component({
  selector: 'app-wheel-info',
  imports: [CommonModule],
  templateUrl: './wheel-info.html',
})
export class WheelInfo {

  // Mock data basado en un Hypercar a temperatura de trabajo
  wheels: CarWheels = {
    frontLeft: { temp: { core: 95, inner: 98, middle: 96, outer: 94 }, pressure: 30.1, brakeTemp: 450, wear: 88, isLocking: false },
    frontRight: { temp: { core: 92, inner: 94, middle: 93, outer: 91 }, pressure: 29.8, brakeTemp: 440, wear: 89, isLocking: false },
    rearLeft: { temp: { core: 102, inner: 105, middle: 103, outer: 101 }, pressure: 31.2, brakeTemp: 380, wear: 85, isLocking: false },
    rearRight: { temp: { core: 101, inner: 104, middle: 102, outer: 100 }, pressure: 31.0, brakeTemp: 375, wear: 86, isLocking: false }
  };

  getTyreColor(temp: number): string {
    if (temp < 70) return 'bg-blue-500';   // Frío
    if (temp < 105) return 'bg-success';   // Óptimo
    if (temp < 120) return 'bg-warning';   // Caliente
    return 'bg-error animate-pulse';       // Sobrecalentado
  }

  getBrakeColor(temp: number): string {
    if (temp < 200) return 'text-blue-400';
    if (temp < 600) return 'text-success';
    if (temp < 850) return 'text-orange-500';
    return 'text-red-600 shadow-sm';
  }
}
