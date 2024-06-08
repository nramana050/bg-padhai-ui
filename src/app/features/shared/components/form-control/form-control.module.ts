import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlComponent } from './form-control.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ValidationService } from './validation.service';
import { DateFormControlComponent } from './date-form-control/date-form-control.component';
import { MonthFormControlComponent } from './date-form-control/month-form-control.component';
import { AllErrorsComponent } from './all-errors/all-errors.component';
import { FormValidatorDirective } from './form-validator.directive';

@NgModule({
  declarations: [
    FormControlComponent, 
    DateFormControlComponent,
    MonthFormControlComponent,
    AllErrorsComponent,
    FormValidatorDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [ValidationService],
  exports: [
    FormControlComponent, 
    DateFormControlComponent,
    MonthFormControlComponent,
    AllErrorsComponent,
    FormValidatorDirective
  ]
})
export class FormControlModule { }
