import { Component, OnInit } from '@angular/core';
import { StepperNavigationService } from './stepper-navigation.service';
import { IStepperNavItem } from './stepper.interface';

@Component({
  selector: 'app-stepper-navigation',
  templateUrl: './stepper-navigation.component.html',
  styleUrls: ['./stepper-navigation.component.scss']
})
export class StepperNavigationComponent {

  stepper: IStepperNavItem[];

  constructor(private readonly stepperNavigationService: StepperNavigationService) {
    this.stepperNavigationService.currentStepper.subscribe(stepper => this.stepper = stepper);
  }

}
