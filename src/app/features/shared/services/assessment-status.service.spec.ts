import { TestBed } from '@angular/core/testing';

import { AssessmentStatusService } from './assessment-status.service';

describe('AssessmentStatusService', () => {
  let service: AssessmentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmentStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
