import { TestBed } from '@angular/core/testing';

import { PadhaiService } from './padhai.service';

describe('PadhaiService', () => {
  let service: PadhaiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PadhaiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
