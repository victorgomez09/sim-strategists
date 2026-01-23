import { Component, signal } from '@angular/core';
import { SessionInfo } from "./components/session-info/session-info";
import { DeltaBars } from "./components/delta-bars/delta-bars";
import { DrivingTiming } from "./components/driving-timing/driving-timing";
import { WheelInfo } from "./components/wheel-info/wheel-info";
import { WheelHistory } from "./components/wheel-history/wheel-history";
import { FuelStrategy } from './components/fuel-strategy/fuel-strategy';
import { InputEfficiency } from "./components/input-efficiency/input-efficiency";

@Component({
  selector: 'app-root',
  imports: [SessionInfo, DeltaBars, DrivingTiming, WheelInfo, WheelHistory, FuelStrategy, InputEfficiency],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
