import { Injectable } from '@angular/core';
import { IStepperNavItem } from './stepper.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepperNavigationService {

  private readonly stepperSource = new BehaviorSubject(null);
  currentStepper = this.stepperSource.asObservable();


  public stepper(data: IStepperNavItem[]) {
    this.stepperSource.next(data);
  }

}
