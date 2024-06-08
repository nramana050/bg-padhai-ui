import { TestBed } from '@angular/core/testing';
import { InPageNavService } from './in-page-nav.service';

describe('InPageNavService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InPageNavService = TestBed.get(InPageNavService);
    expect(service).toBeTruthy();
  });
});
