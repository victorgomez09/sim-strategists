import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStrategy } from './fuel-strategy';

describe('FuelStrategy', () => {
  let component: FuelStrategy;
  let fixture: ComponentFixture<FuelStrategy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelStrategy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelStrategy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
