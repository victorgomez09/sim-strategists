import { TestBed } from '@angular/core/testing';

import { SharedMemory } from './shared-memory';

describe('SharedMemory', () => {
  let service: SharedMemory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedMemory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
