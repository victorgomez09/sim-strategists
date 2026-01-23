import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeltaBars } from './delta-bars';

describe('DeltaBars', () => {
  let component: DeltaBars;
  let fixture: ComponentFixture<DeltaBars>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeltaBars]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeltaBars);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
