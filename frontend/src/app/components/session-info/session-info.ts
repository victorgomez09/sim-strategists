import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { LMU_Session } from '../../models/shared-memory';

@Component({
  selector: 'app-session-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-info.html',
})
export class SessionInfo {
  session = input<LMU_Session>();

  getFlagColor(flag: string | undefined): string {
    switch (flag) {
      case 'YELLOW':
        return '#ffde00';
      case 'BLUE':
        return '#0088ff';
      case 'RED':
        return '#ff0000';
      case 'GREEN':
        return '#1fb271';
      default:
        return 'transparent';
    }
  }

  formatTime(seconds: number | undefined): string {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
