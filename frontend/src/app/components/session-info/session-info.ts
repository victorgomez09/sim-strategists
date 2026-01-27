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
  session = input<LMU_Session>()
}
