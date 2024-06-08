import { TestBed } from '@angular/core/testing';

import { StepperNavigationService } from './stepper-navigation.service';

describe('StepperNavigationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StepperNavigationService = TestBed.get(StepperNavigationService);
    expect(service).toBeTruthy();
  });
});
