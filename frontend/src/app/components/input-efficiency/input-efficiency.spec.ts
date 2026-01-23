import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputEfficiency } from './input-efficiency';

describe('InputEfficiency', () => {
  let component: InputEfficiency;
  let fixture: ComponentFixture<InputEfficiency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputEfficiency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputEfficiency);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
