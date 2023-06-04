import { TestBed } from '@angular/core/testing';

import { AccoutService } from './accout.service';

describe('AccoutService', () => {
  let service: AccoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
