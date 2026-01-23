import { TestBed } from '@angular/core/testing';

import { SessionInfo } from './session-info';

describe('SessionInfo', () => {
  let service: SessionInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionInfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
