import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

interface courseStatusDetails{

  courseStatus: string,
  assetStatus: string,
  lessonStatus: string,
  outcomeStatus: string,
  outlineStatus: string,
  publishStatus: string
}

@Component({
  selector: 'app-stepper-bar',
  templateUrl: './stepper-bar.component.html',
  styleUrls: ['./stepper-bar.component.scss']
})
export class StepperBarComponent implements OnChanges {

  @Input() courseStatusDetails : courseStatusDetails;

  stepperConfig = {
    steps : [
        {
          title : 'Course requirements',
          status : 'current'
        },
        {
          title : 'Outline generated',
          status : ''
        },
        {
          title : 'Lesson generated',
          status : ''
        },
        {
          title : 'Learning outcomes',
          status : ''
        },
        {
          title : 'Ready to export',
          status : ''
        },
        {
          title : 'Course ready',
          status : ''
        }
    ]
  }

  activeStage = {
    title : 'Course requirements',
    status : 'current'
  };

  constructor() { }

  ngOnChanges(): void {

      this.setStepperStatus(); 
  }

  setStepperStatus(){

    switch (this.courseStatusDetails?.courseStatus) {

      case 'Outline':

        this.stepperConfig.steps[0].status = 'Generated';
        this.stepperConfig.steps[1].status = this.courseStatusDetails.outlineStatus == 'Generated' ? 'current' : this.courseStatusDetails.outlineStatus.replace(/\s/g, '');
        this.activeStage = this.stepperConfig.steps[1];
        
        break;

      case 'Lesson':

        this.stepperConfig.steps[0].status = 'Generated';
        this.stepperConfig.steps[1].status = 'Generated';
        this.stepperConfig.steps[2].status = this.courseStatusDetails.lessonStatus == 'Generated' ? 'current' : this.courseStatusDetails.lessonStatus.replace(/\s/g, '');
        this.activeStage = this.stepperConfig.steps[2];
        break;

      case 'Outcome':

        this.stepperConfig.steps[0].status = 'Generated';
        this.stepperConfig.steps[1].status = 'Generated';
        this.stepperConfig.steps[2].status = 'Generated';
        this.stepperConfig.steps[3].status = this.courseStatusDetails.outcomeStatus == 'Generated' ? 'current' : this.courseStatusDetails.outcomeStatus.replace(/\s/g, '');
        this.activeStage = this.stepperConfig.steps[3];
        break;

      case 'Asset':
        
        this.stepperConfig.steps[0].status = 'Generated';
        this.stepperConfig.steps[1].status = 'Generated';
        this.stepperConfig.steps[2].status = 'Generated';
        this.stepperConfig.steps[3].status = 'Generated';
        this.stepperConfig.steps[4].status = this.courseStatusDetails.assetStatus == 'Generated' ? 'current' : this.courseStatusDetails.assetStatus.replace(/\s/g, '');
        this.activeStage = this.stepperConfig.steps[4];
        break;

      case 'Publish':
        
        this.stepperConfig.steps[0].status = 'Generated';
        this.stepperConfig.steps[1].status = 'Generated';
        this.stepperConfig.steps[2].status = 'Generated';
        this.stepperConfig.steps[3].status = 'Generated';
        this.stepperConfig.steps[4].status = 'Generated';
        this.stepperConfig.steps[5].status = this.courseStatusDetails.publishStatus == 'Generated' ? 'current' : this.courseStatusDetails.publishStatus.replace(/\s/g, '');
        this.activeStage = this.stepperConfig.steps[5];
        break;

      default:
        break;
    }
  }

}
