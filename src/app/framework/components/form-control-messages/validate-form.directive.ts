import { Directive, Input, HostListener } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ValidatorService } from './validator.service';
import { Utility } from '../../utils/utility';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appValidateForm]'
})
export class ValidateFormDirective {

  @Input() form: FormGroup;
  private subscription: Subscription;

  @HostListener('click', ['$event']) onClick($event) {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(control => {
        this.form.controls[control].markAsTouched();
        if (this.form.controls[control] instanceof FormGroup) {
          const formGroup: FormGroup = this.form.controls[control] as FormGroup;
          Object.keys(formGroup.controls).forEach(groupControl => {
            formGroup.controls[groupControl].markAsTouched();
          });
        }
        if (this.form.controls[control] instanceof FormArray) {
          const formArray = this.form.controls[control] as FormArray;
          for (let i = 0; i < formArray.length; i++) {
            const formGroup: FormGroup = formArray.controls[i] as FormGroup;
            Object.keys(formGroup.controls).forEach(arrayControl => {
              formGroup.controls[arrayControl].markAsTouched();
            });
          }
        }
      });
    }
    this.subscription = this.validatorService.formValidator.subscribe((errors: any[]) => {
      if (errors != null && errors.length > 0) {
        errors.forEach((error, index) => {
          this.form.get(error.field).setErrors({errorMessage: error.errorMessage});
        });
      }
      this.subscription.unsubscribe();
    });
  }
  constructor(private readonly validatorService: ValidatorService) { }

}
