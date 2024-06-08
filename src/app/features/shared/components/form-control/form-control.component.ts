import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from './validation.service';

@Component({
  selector: 'vc-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.scss']
})
export class FormControlComponent implements OnInit {

  @Input() control: FormControl;
  @Input() label: string;
  @Input() optional: string;
  @Input() hint: string;
  @Input() controlName: string;
  @Input() fromContext: boolean = false;
  @Input() formSubmitted: boolean = true;
  @Input() insetText: string;
  @Input() sublabel: string;

  constructor(private readonly validationService: ValidationService) { }

  get errorMessage(): string {
    for (const propertyName in this.control?.errors) {
      if (propertyName === 'serverError') {
        return this.control.getError(propertyName);
      } else if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return this.fromContext 
          ? this.validationService.getValidationMessageFromContext(propertyName, this.controlName) 
          : this.validationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }

  ngOnInit() {
    this.radioClass();
  }

  radioClass() {
    const radios = document.getElementsByName(this.controlName);
    if (radios && radios.length === 2) {
      radios.forEach(radio => radio.parentElement.classList.add('inlineRadioButtons'));
    }
  }

}
