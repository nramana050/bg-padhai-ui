// assessment-status.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssessmentStatusService {
  private assessmentSavedSubject = new BehaviorSubject<boolean>(false);
  assessmentSaved$ = this.assessmentSavedSubject.asObservable();

  setAssessmentSaved(value: boolean) {
    this.assessmentSavedSubject.next(value);
  }
}
