import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelInfo } from './wheel-info';

describe('WheelInfo', () => {
  let component: WheelInfo;
  let fixture: ComponentFixture<WheelInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WheelInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
