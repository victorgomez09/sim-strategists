import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionInfo } from './session-info';

describe('SessionInfo', () => {
  let component: SessionInfo;
  let fixture: ComponentFixture<SessionInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
