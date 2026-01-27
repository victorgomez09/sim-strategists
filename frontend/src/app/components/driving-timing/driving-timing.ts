import { CommonModule } from '@angular/common';
import { Component, input, effect } from '@angular/core';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/angular-table';
import { LMU_LeaderboardEntry } from '../../models/shared-memory';

@Component({
  selector: 'app-driving-timing',
  standalone: true,
  imports: [CommonModule, FlexRenderDirective],
  templateUrl: './driving-timing.html',
  styleUrl: './driving-timing.css',
})
export class DrivingTiming {
  // Input que recibe los datos reales desde el servicio/bridge
  leaderboard = input<LMU_LeaderboardEntry[]>([]);

  readonly columns: ColumnDef<LMU_LeaderboardEntry>[] = [
    {
      id: 'pos',
      header: 'POS',
      cell: (info) => {
        const row = info.row.original;
        const change = row.positionChange;
        const changeColor = change > 0 ? 'text-success' : change < 0 ? 'text-error' : 'opacity-20';
        const arrow = change > 0 ? '▲' : change < 0 ? '▼' : '•';

        return `
      <div class="flex items-center gap-2">
        <div class="flex flex-col items-center min-w-5">
          <span class="text-xl font-black italic">${row.position}</span>
          <span class="text-[8px] font-bold ${changeColor}">${arrow} ${Math.abs(change)}</span>
        </div>
      </div>
    `;
      },
    },
    {
      accessorKey: 'driverName',
      header: 'Competitor',
      cell: (info) => {
        const row = info.row.original;
        return `
          <div class="flex flex-col justify-center py-1">
            <div class="flex items-center gap-2">
              <span class="font-black uppercase italic text-sm ${row.isPlayer ? 'text-primary' : 'text-white'}">${info.getValue()}</span>
              ${row.inPits ? '<span class="px-1.5 py-0.5 bg-error text-[8px] font-black rounded animate-pulse">PIT</span>' : ''}
            </div>
            <span class="text-[9px] opacity-40 font-bold uppercase tracking-tight">${row.carName}</span>
          </div>
        `;
      },
    },
    {
      accessorKey: 'gapToLeader',
      header: 'Gap/Diff',
      cell: (info) => `<span class="font-mono text-xs opacity-80">${info.getValue()}</span>`,
    },
    {
      accessorKey: 'lastLap',
      header: 'Last Lap',
      cell: (info) => {
        const val = info.getValue() as string;
        // Si la última vuelta es muy buena, le damos un toque sutil
        return `<span class="font-mono text-xs ${val.startsWith('3:24') ? 'text-success' : 'text-white/70'}">${val}</span>`;
      },
    },
    {
      accessorKey: 'bestLap',
      header: 'Personal Best',
      cell: (info) => {
        const val = info.getValue() as string;
        return `<span class="font-mono text-xs font-bold text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.3)]">${val}</span>`;
      },
    },
    {
      id: 'sectors',
      header: 'Sectors',
      cell: (info) => {
        const sectors = info.row.original.sectors;

        const getDot = (color: string) => {
          const colorClass =
            color === 'purple'
              ? 'bg-purple-500 shadow-[0_0_8px_purple]'
              : color === 'green'
                ? 'bg-success shadow-[0_0_8px_#1fb271]'
                : 'bg-warning opacity-50';

          return `<div class="w-3 h-1.5 rounded-full ${colorClass} transition-all duration-500"></div>`;
        };

        return `
      <div class="flex gap-1.5 justify-center items-center h-full">
        ${getDot(sectors.s1)}
        ${getDot(sectors.s2)}
        ${getDot(sectors.s3)}
      </div>
    `;
      },
    },
    {
      id: 'strategy',
      header: 'STRAT',
      cell: (info) => {
        const row = info.row.original;
        return `
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] font-bold px-1 rounded bg-white/10 border border-white/20">${row.tyreCompound[0]}</span>
          <span class="text-[9px] opacity-60">Age: ${row.tyreAge}L</span>
        </div>
        <div class="w-full bg-white/5 h-0.5 rounded-full overflow-hidden">
          <div class="bg-primary h-full" style="width: ${Math.max(0, 100 - row.tyreAge * 4)}%"></div>
        </div>
      </div>
    `;
      },
    },
    {
      id: 'stint',
      header: 'Stint',
      cell: (info) => {
        const row = info.row.original;
        const lapsSincePit = row.laps - row.lastPitLap;

        // Alarma visual si el stint es largo (específico para Hypercars)
        const warningClass = lapsSincePit >= 12 ? 'text-warning font-bold' : 'opacity-70';

        return `
      <div class="flex flex-col items-center">
        <span class="text-[10px] ${warningClass}">${lapsSincePit} Laps</span>
        <span class="text-[8px] opacity-30 uppercase">Since Pit</span>
      </div>
    `;
      },
    },
  ];

  // Instancia de la tabla
  table = createAngularTable(() => ({
    data: this.leaderboard(),
    columns: this.columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  }));

  constructor() {
    // Cada vez que cambien los datos del input, forzar actualización de la tabla
    effect(() => {
      this.table.setOptions((prev) => ({
        ...prev,
        data: this.leaderboard(),
      }));
    });
  }

  getSortIcon(column: any): string {
    const isSorted = column.getIsSorted();
    if (isSorted === 'asc') return ' ▲';
    if (isSorted === 'desc') return ' ▼';
    return '';
  }
}
