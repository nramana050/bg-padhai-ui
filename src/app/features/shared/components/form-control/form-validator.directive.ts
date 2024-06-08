import { Directive, Input, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ValidationService } from './validation.service';

@Directive({
  selector: '[vcFormValidator]'
})
export class FormValidatorDirective {

  @Input() form: FormGroup;
  private subscription: Subscription;

  @HostListener('click', ['$event'])
  onClick(event: any) {
    this.subscription = this.validationService.formValidator.subscribe((errors: any[]) => {
      if (errors != null && errors.length > 0) {
        errors.forEach((error, index) => {
          this.form.get(error.field).setErrors({ serverError: error.errorMessage });
        });
        this.focusToErrorSummary();
      }
      this.subscription.unsubscribe();
    });
    
  }

  focusToErrorSummary() {
    setTimeout(() => {
      const dom = document.getElementsByClassName('error-summary').item(0);
      if (dom) {
        (dom as HTMLElement).focus();
      }
    });
  }

  constructor(private readonly validationService: ValidationService) { }

}
