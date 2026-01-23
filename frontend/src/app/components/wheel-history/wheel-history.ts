import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartOptions,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
  ChartConfiguration,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Title,
  Tooltip,
  Legend,
);

@Component({
  selector: 'app-wheel-history',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './wheel-history.html',
})
export class WheelHistory implements OnInit {
  // Configuración del gráfico (Estilo WEC/Moderno)
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: Array.from({ length: 20 }, (_, i) => `${i * 5}%`), // Progreso de la vuelta
    datasets: [
      {
        data: [
          85, 88, 92, 95, 98, 102, 105, 103, 98, 95, 92, 94, 98, 105, 110, 108, 102, 95, 90, 88,
        ],
        label: 'Front Left',
        borderColor: '#ff5252',
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        data: [82, 84, 86, 88, 90, 92, 95, 94, 92, 90, 88, 89, 92, 95, 98, 97, 94, 90, 85, 84],
        label: 'Front Right',
        borderColor: '#42a5f5',
        backgroundColor: 'rgba(66, 165, 245, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 2,
      },
    },
    clip: false, // Permite que la línea respire en los bordes
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } },
        min: 70,
        max: 120,
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 9 } },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  ngOnInit() {
    // Aquí iría la lógica para capturar datos del Shared Memory cada segundo
  }
}
