import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

//@Directive()
@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  @Output() formValidator: EventEmitter<any> = new EventEmitter<any>();

  static getValidatorErrorMessage(validatorName: string, obj?: any) {
    const config = {
      minlength: `Minimum length`,
      maxlength: `Maximum length exceeded`,
      pattern: 'Invalid value',
      required: 'Mandatory field ',
      invalidDateTime: 'Invalid date time format',
      invalidTime: 'Invalid time format',
      invalidName: `Invalid value`,
      invalidValue: `Invalid value`,
      invalidNumber: `Invalid Number`,
      numberOnly: `Only numeric value allowed`,
      invalidCrn: `Invalid CRN`,
      invalidLength: `The length as entered should be less than or equal to 6`,
      max: `Value cannot be greater than ${obj.max}`,
      min: `Value cannot be less than ${obj.min}`,
      dateBefore: `Please select today or future date`,
      dateBeforeGeneric: `Please select date after`,
      invalidYear: `Date should be greater than 01/01/1900`,
      dateAfterGeneric: `Please select date before `,
      quantityGreaterThanCapacity: `The Total of Role Quantities cannot exceed the Workshop Capacity`,
      timeOutGreaterThanTimeIn: 'Time In should be after the Time Out'
    };

    return config[validatorName];
  }

  static alphaNumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (control.value == null || control.value === '') {
        return null;
      }
      if (!control.value.match(/^[a-zA-Z0-9]*$/)) {
        return { pattern: true };
      } else {
        return null;
      }
    };
  }

  static timeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (control.value == null || control.value === '') {
        return null;
      }
      if (!control.value.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) {
        return { invalidTime: true };
      } else {
        return null;
      }
    };
  }


  static characterValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (control.value == null || control.value === '') {
        return null;
      }
      if (!control.value.match(/^[a-zA-Z]*$/)) {
        return { pattern: true };
      } else {
        return null;
      }
    };
  }

  static numericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (control.value == null || control.value === '') {
        return null;
      }
      if (!control.value.match(/^[0-9]*$/)) {
        return { numberOnly: true };
      } else {
        return null;
      }
    };
  }

  setformSererValidator(error) {
    this.formValidator.emit(error);
  }

  static urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (control.value == null || control.value === '') {
        return null;
      }
      let url;

      try {
        url = new URL(control.value);
      } catch (_) {
        const isValidProtocol = (control.value.startsWith("http://") || control.value.startsWith("https://")
          || control.value.startsWith("www.")) || (control.value.indexOf(".co") != -1 || control.value.indexOf(".net") != -1);
        if (!isValidProtocol) {
          return { invalidUrl: true };
        } else {
          return null;
        }
      }
      const isValidProtocol = (control.value.startsWith("http://") || control.value.startsWith("https://")
        || control.value.startsWith("www.")) || (control.value.indexOf(".co") != -1 || control.value.indexOf(".net") != -1);

      if (!isValidProtocol) {
        return { invalidUrl: true };
      } else {
        return null;
      }
    };
  }

}
