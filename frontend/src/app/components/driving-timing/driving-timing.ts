import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/angular-table';
import { DriverTiming } from '../../models/driving-timing';

@Component({
  selector: 'app-driving-timing',
  imports: [CommonModule, FlexRenderDirective],
  templateUrl: './driving-timing.html',
  styleUrl: './driving-timing.css',
})
export class DrivingTiming {
  // Datos Mock
readonly data = signal<DriverTiming[]>([
  // --- HYPERCAR CLASS ---
  { position: 1, classPosition: 1, name: 'K. Estre', carName: 'Porsche 963', laps: 45, class: 'HYPERCAR', lastLap: '1:39.230', bestLap: '1:39.105', gapToLeader: '--', interval: '--', pits: 2, isPitLane: false, sector1: 'purple', sector2: 'green', sector3: 'yellow', tyreAge: 8, positionChange: 0 },
  { position: 2, classPosition: 2, name: 'R. Kubica', carName: 'Ferrari 499P', laps: 45, class: 'HYPERCAR', lastLap: '1:39.550', bestLap: '1:39.400', gapToLeader: '+1.240', interval: '+1.240', pits: 2, isPitLane: false, sector1: 'green', sector2: 'green', sector3: 'green', tyreAge: 12, positionChange: 1 },
  { position: 3, classPosition: 3, name: 'S. Buemi', carName: 'Toyota GR010', laps: 45, class: 'HYPERCAR', lastLap: '1:40.100', bestLap: '1:39.850', gapToLeader: '+5.800', interval: '+4.560', pits: 2, isPitLane: false, sector1: 'yellow', sector2: 'green', sector3: 'yellow', tyreAge: 15, positionChange: -1 },
  { position: 4, classPosition: 4, name: 'A. Lynn', carName: 'Cadillac V-Series.R', laps: 45, class: 'HYPERCAR', lastLap: '1:40.890', bestLap: '1:40.100', gapToLeader: '+12.300', interval: '+6.500', pits: 2, isPitLane: true, sector1: 'yellow', sector2: 'yellow', sector3: 'yellow', tyreAge: 22, positionChange: 0 },
  { position: 5, classPosition: 5, name: 'M. Rockenfeller', carName: 'Porsche 963', laps: 45, class: 'HYPERCAR', lastLap: '1:40.400', bestLap: '1:40.250', gapToLeader: '+15.200', interval: '+2.900', pits: 2, isPitLane: false, sector1: 'green', sector2: 'yellow', sector3: 'green', tyreAge: 5, positionChange: 2 },
  { position: 6, classPosition: 6, name: 'N. de Vries', carName: 'Toyota GR010', laps: 45, class: 'HYPERCAR', lastLap: '1:39.900', bestLap: '1:39.900', gapToLeader: '+18.100', interval: '+2.900', pits: 2, isPitLane: false, sector1: 'purple', sector2: 'yellow', sector3: 'green', tyreAge: 3, positionChange: 4 },
  { position: 7, classPosition: 7, name: 'D. Fuoco', carName: 'Ferrari 499P', laps: 44, class: 'HYPERCAR', lastLap: '1:41.200', bestLap: '1:39.500', gapToLeader: '+1 Lap', interval: '+22.000', pits: 3, isPitLane: false, sector1: 'yellow', sector2: 'yellow', sector3: 'yellow', tyreAge: 18, positionChange: -3 },
  { position: 8, classPosition: 8, name: 'S. van der Linde', carName: 'BMW M Hybrid V8', laps: 44, class: 'HYPERCAR', lastLap: '1:40.950', bestLap: '1:40.500', gapToLeader: '+1 Lap', interval: '+15.400', pits: 2, isPitLane: false, sector1: 'green', sector2: 'yellow', sector3: 'yellow', tyreAge: 10, positionChange: 0 },

  // --- LMP2 CLASS ---
  { position: 9, classPosition: 1, name: 'F. Albuquerque', carName: 'Oreca 07', laps: 43, class: 'LMP2', lastLap: '1:45.300', bestLap: '1:44.900', gapToLeader: '+2 Laps', interval: '+1:10.500', pits: 2, isPitLane: false, sector1: 'purple', sector2: 'green', sector3: 'green', tyreAge: 9, positionChange: 1 },
  { position: 10, classPosition: 2, name: 'L. Deletraz', carName: 'Oreca 07', laps: 43, class: 'LMP2', lastLap: '1:45.800', bestLap: '1:45.100', gapToLeader: '+2 Laps', interval: '+5.200', pits: 2, isPitLane: false, sector1: 'green', sector2: 'yellow', sector3: 'green', tyreAge: 14, positionChange: -1 },
  { position: 11, classPosition: 3, name: 'B. Hanley', carName: 'Oreca 07', laps: 43, class: 'LMP2', lastLap: '1:46.200', bestLap: '1:45.500', gapToLeader: '+2 Laps', interval: '+12.800', pits: 2, isPitLane: false, sector1: 'yellow', sector2: 'yellow', sector3: 'yellow', tyreAge: 20, positionChange: 2 },
  { position: 12, classPosition: 4, name: 'P. Fittipaldi', carName: 'Oreca 07', laps: 43, class: 'LMP2', lastLap: '1:45.900', bestLap: '1:45.800', gapToLeader: '+2 Laps', interval: '+4.100', pits: 2, isPitLane: true, sector1: 'yellow', sector2: 'yellow', sector3: 'yellow', tyreAge: 25, positionChange: -1 },
  { position: 13, classPosition: 5, name: 'N. Jani', carName: 'Oreca 07', laps: 42, class: 'LMP2', lastLap: '1:46.500', bestLap: '1:46.000', gapToLeader: '+3 Laps', interval: '+45.200', pits: 3, isPitLane: false, sector1: 'green', sector2: 'green', sector3: 'yellow', tyreAge: 6, positionChange: 0 },

  // --- GT3 CLASS ---
  { position: 14, classPosition: 1, name: 'V. Rossi', carName: 'BMW M4 GT3', laps: 41, class: 'GT3', lastLap: '1:55.200', bestLap: '1:54.800', gapToLeader: '+4 Laps', interval: '+1:40.200', pits: 2, isPitLane: false, sector1: 'purple', sector2: 'purple', sector3: 'green', tyreAge: 7, positionChange: 3 },
  { position: 15, classPosition: 2, name: 'A. Farfus', carName: 'BMW M4 GT3', laps: 41, class: 'GT3', lastLap: '1:55.600', bestLap: '1:54.950', gapToLeader: '+4 Laps', interval: '+4.500', pits: 2, isPitLane: false, sector1: 'green', sector2: 'green', sector3: 'green', tyreAge: 11, positionChange: -1 },
  { position: 16, classPosition: 3, name: 'M. Gatting', carName: 'Lamborghini Huracán', laps: 41, class: 'GT3', lastLap: '1:55.900', bestLap: '1:55.200', gapToLeader: '+4 Laps', interval: '+8.100', pits: 2, isPitLane: false, sector1: 'yellow', sector2: 'green', sector3: 'yellow', tyreAge: 14, positionChange: 0 },
  { position: 17, classPosition: 4, name: 'D. Perel', carName: 'Ferrari 296 GT3', laps: 41, class: 'GT3', lastLap: '1:56.400', bestLap: '1:55.500', gapToLeader: '+4 Laps', interval: '+12.400', pits: 2, isPitLane: false, sector1: 'green', sector2: 'yellow', sector3: 'yellow', tyreAge: 18, positionChange: 2 },
  { position: 18, classPosition: 5, name: 'T. Boguslavskiy', carName: 'Lexus RC F GT3', laps: 41, class: 'GT3', lastLap: '1:57.100', bestLap: '1:56.200', gapToLeader: '+4 Laps', interval: '+25.600', pits: 2, isPitLane: false, sector1: 'yellow', sector2: 'yellow', sector3: 'yellow', tyreAge: 21, positionChange: -2 },
  { position: 19, classPosition: 6, name: 'K. Kobayashi', carName: 'Lexus RC F GT3', laps: 40, class: 'GT3', lastLap: '1:55.800', bestLap: '1:55.800', gapToLeader: '+5 Laps', interval: '+1:15.000', pits: 3, isPitLane: false, sector1: 'green', sector2: 'green', sector3: 'green', tyreAge: 4, positionChange: 5 },
  { position: 20, classPosition: 7, name: 'R. Frey', carName: 'Lamborghini Huracán', laps: 40, class: 'GT3', lastLap: '1:58.200', bestLap: '1:56.900', gapToLeader: '+5 Laps', interval: '+18.200', pits: 2, isPitLane: false, sector1: 'yellow', sector2: 'yellow', sector3: 'yellow', tyreAge: 26, positionChange: -1 },
  { position: 21, classPosition: 8, name: 'B. Barker', carName: 'Ford Mustang GT3', laps: 40, class: 'GT3', lastLap: '1:57.900', bestLap: '1:57.500', gapToLeader: '+5 Laps', interval: '+5.400', pits: 2, isPitLane: true, sector1: 'yellow', sector2: 'yellow', sector3: 'yellow', tyreAge: 28, positionChange: 0 },
  { position: 22, classPosition: 9, name: 'G. Saucy', carName: 'McLaren 720S GT3', laps: 40, class: 'GT3', lastLap: '1:58.500', bestLap: '1:58.100', gapToLeader: '+5 Laps', interval: '+12.100', pits: 2, isPitLane: false, sector1: 'yellow', sector2: 'yellow', sector3: 'yellow', tyreAge: 12, positionChange: -2 },
  { position: 23, classPosition: 10, name: 'E. Bastard', carName: 'Aston Martin Vantage', laps: 40, class: 'GT3', lastLap: '1:59.100', bestLap: '1:58.800', gapToLeader: '+5 Laps', interval: '+8.900', pits: 2, isPitLane: false, sector1: 'yellow', sector2: 'yellow', sector3: 'yellow', tyreAge: 15, positionChange: 0 },
  { position: 24, classPosition: 11, name: 'C. Eastwood', carName: 'Corvette Z06 GT3.R', laps: 39, class: 'GT3', lastLap: '1:57.400', bestLap: '1:57.400', gapToLeader: '+6 Laps', interval: '+1:20.000', pits: 4, isPitLane: false, sector1: 'green', sector2: 'green', sector3: 'green', tyreAge: 2, positionChange: 1 },
  { position: 25, classPosition: 12, name: 'M. Sorensen', carName: 'Aston Martin Vantage', laps: 39, class: 'GT3', lastLap: '2:01.200', bestLap: '1:59.500', gapToLeader: '+6 Laps', interval: '+45.000', pits: 3, isPitLane: false, sector1: 'yellow', sector2: 'red', sector3: 'yellow', tyreAge: 19, positionChange: -1 },
]);

  // Definición de Columnas con TanStack
  readonly columns: ColumnDef<DriverTiming>[] = [
    {
      accessorKey: 'position',
      id: 'position',
      header: 'Pos',
      cell: (info) => {
        const row = info.row.original;
        const classColor = this.getClassColor(row.class);

        // Renderizamos un bloque con las dos posiciones
        return `
        <div class="flex items-center gap-3">
          <div class="w-1 h-10 ${classColor}"></div>
          
          <div class="flex flex-col justify-center leading-none">
            <div class="flex items-baseline gap-1">
              <span class="text-xl font-black italic text-white">${row.classPosition}</span>
              <span class="text-[10px] font-bold opacity-40 uppercase">${row.class}</span>
            </div>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="text-[10px] font-mono opacity-60">P${row.position} OVERALL</span>
            </div>
          </div>
          
          <div class="ml-2 flex flex-col justify-center">
            <span class="text-[9px] font-bold opacity-30 uppercase tracking-tighter leading-tight">Vehicle</span>
            <span class="text-[10px] font-black text-primary/80 truncate max-w-[80px] uppercase italic">
              ${row.carName}
            </span>
          </div>
        </div>
      `;
      },
    },
    {
      accessorKey: 'name',
      header: 'Driver',
      cell: (info) => {
        const row = info.row.original;
        return `
          <div class="flex items-center gap-2">
            <span class="font-bold uppercase italic text-white">${info.getValue()}</span>
            ${row.isPitLane ? '<span class="badge badge-error badge-xs animate-pulse font-black text-[8px]">PIT</span>' : ''}
          </div>
        `;
      },
    },
    { accessorKey: 'laps', header: 'Laps' },
    { accessorKey: 'gapToLeader', header: 'Gap' },
    { accessorKey: 'lastLap', header: 'Last Lap' },
    {
      accessorKey: 'bestLap',
      header: 'Best',
      cell: (info) => `<span class="text-success font-bold">${info.getValue()}</span>`,
    },
    {
      id: 'sectors',
      header: 'Sectors',
      cell: (info) => {
        const row = info.row.original;
        const getDot = (s: string) => {
          const color =
            s === 'purple'
              ? 'bg-purple-500 shadow-[0_0_5px_purple]'
              : s === 'green'
                ? 'bg-success shadow-[0_0_5px_green]'
                : 'bg-warning';
          return `<div class="w-3 h-1.5 rounded-full ${color}"></div>`;
        };
        return `<div class="flex gap-1 justify-center">${getDot(row.sector1)}${getDot(row.sector2)}${getDot(row.sector3)}</div>`;
      },
    },
  ];

  constructor() {
    // Cargar configuración guardada al iniciar
    const savedVisibility = localStorage.getItem('columnVisibility');
    if (savedVisibility) {
      this.table.setColumnVisibility(JSON.parse(savedVisibility));
    }
  }

  // Inicialización de la Tabla
  table = createAngularTable(() => ({
    data: this.data(),
    columns: this.columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  }));

  getSortIcon(column: any): string {
    const isSorted = column.getIsSorted();
    if (isSorted === 'asc') return '▲';
    if (isSorted === 'desc') return '▼';
    return '';
  }

  onVisibilityChange(updaterOrValue: any) {
    this.table.setColumnVisibility(updaterOrValue);
    localStorage.setItem(
      'columnVisibility',
      JSON.stringify(this.table.getState().columnVisibility),
    );
  }

  private getClassColor(className: string): string {
    switch (className.toUpperCase()) {
      case 'HYPERCAR':
        return 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]';
      case 'LMP2':
        return 'bg-blue-500';
      case 'GT3':
        return 'bg-orange-400';
      default:
        return 'bg-gray-500';
    }
  }
}
