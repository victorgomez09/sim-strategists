import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivingTiming } from './driving-timing';

describe('DrivingTiming', () => {
  let component: DrivingTiming;
  let fixture: ComponentFixture<DrivingTiming>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrivingTiming]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrivingTiming);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
