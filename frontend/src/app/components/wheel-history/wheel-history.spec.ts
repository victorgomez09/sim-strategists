import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelHistory } from './wheel-history';

describe('WheelHistory', () => {
  let component: WheelHistory;
  let fixture: ComponentFixture<WheelHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WheelHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
