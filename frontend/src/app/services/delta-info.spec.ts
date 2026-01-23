import { TestBed } from '@angular/core/testing';

import { DeltaInfo } from './delta-info';

describe('DeltaInfo', () => {
  let service: DeltaInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeltaInfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
