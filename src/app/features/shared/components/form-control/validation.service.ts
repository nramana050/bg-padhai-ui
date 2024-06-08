import { Injectable, Output, EventEmitter } from '@angular/core';
import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import * as moment from 'moment';
const dateFormate = 'YYYY-MM-DD';
const yearString = 'years';
@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  formValidator: EventEmitter<any> = new EventEmitter<any>();
  context: any;

  static ifChecked(control) {
    if (!control.value) {
      return { ifChecked: true };
    } else {
      return null;
    }
  }

  static niNumberValidator(control) {
    if (control.value === '') {
      return null;
    }
    if (control.value.match(/^[A-Z]{2}\s[0-9]{2}\s[0-9]{2}\s[0-9]{2}\s[A-Z]{1}$/gi)) {
      const val = (control.value as string).toUpperCase();
      if (['BG', 'GB', 'KN', 'NK', 'NT', 'TN', 'ZZ'].includes(val.substring(0, 2))) {
        return { invalidniNumberPrefix: true };
      }
      if (['D', 'F', 'I', 'Q', 'U', 'V'].filter(each => val.substring(0, 2).includes(each)).length > 0) {
        return { invalidniNumberPrefixLetters: true };
      }
      if (val.substring(1, 2).includes('O')) {
        return { invalidniNumberPrefix2ndLetter: true };
      }
      if (['A', 'B', 'C', 'D'].filter(each => val.substring(12, 13).includes(each)).length === 0) {
        return { invalidniNumberPrefixLastLetter: true };
      }
      return null;
    } else {
      return { invalidniNumber: true };
    }
  }


  static dateValidator(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    let day = null;
    let month = null;
    let year = null;
    const res = control.value.split('-');
    if (res.length > 1) {
      year = res[0];
      month = res[1];
      day = res[2];
    }
    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      return { invalidDate: true };
    }
    day = Number(day);
    month = Number(month);
    year = Number(year);
    if (!ValidationService.dayMonthYearValidate(month, day, year)) {
      return { invalidDate: true };
    }
    if (month === 2) { // check for february 29th
      const isleap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
      if (day > 29 || (day === 29 && !isleap)) {
        return { invalidDate: true };
      }
    }
    return null;
  }

  static monthYearValidator(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    let month = null;
    let year = null;
    const res = control.value.split('-');
    if (res.length > 1) {
      year = res[0];
      month = res[1];
    }
    if (isNaN(month) || isNaN(year)) {
      return { invalidDate: true };
    }
    month = Number(month);
    year = Number(year);
    if (!ValidationService.monthYearValidate(month, year)) {
      return { invalidDate: true };
    }
    return null;
  }

  static monthYearValidate(month: number, year: number) {
    if (month < 1 || month > 12) {
      return false;
    }
    if (year <= 0) {
      return false;
    }
    return true;
  }

  static dayMonthYearValidate(month: number, day: number, year: number) {
    if (month < 1 || month > 12) {
      return false;
    }
    if (year <= 0) {
      return false;
    }
    if (day < 1 || day > 31) {
      return false;
    }
    if ((month === 4 || month === 6 || month === 9 || month === 11) && day === 31) {
      return false;
    }
    return true;
  }

  static minSelected(min: number) {
    const validator: ValidatorFn = (control: AbstractControl) => {
      const checked = (control.value as any[]).filter(each => each.checked);
      const totalSelected = checked.length;
      return totalSelected < min ? { minSelected: true } : null;
    };
    return validator;
  }

  static maxSelected(max: number) {
    const validator: ValidatorFn = (control: AbstractControl) => {
      const checked = (control.value as any[]).filter(each => each.checked);
      const totalSelected = checked.length;
      return totalSelected > max ? { maxSelected: true } : null;
    };
    return validator;
  }

  static invalidEndDateOrCurrent(startDateCtrName: string, endDateCtrName: string, isCurrentCtrName: string) {
    const validator: ValidatorFn = (control: AbstractControl) => {
      const group = control.parent as FormGroup;
      const startDate = group.get(startDateCtrName).value ? group.get(startDateCtrName).value.split('-') : null;
      const endDate = group.get(endDateCtrName).value ? group.get(endDateCtrName).value.split('-') : null;
      const isCurrent = group.get(isCurrentCtrName).value;

      let startYear;
      let startMonth;
      let endYear;
      let endMonth;

      if (startDate && startDate.length > 0) {
        startYear = startDate[0];
        startMonth = startDate[1];
      }

      if (endDate && endDate.length > 0) {
        endYear = endDate[0];
        endMonth = endDate[1];
      }

      if ((!isNaN(startYear) && !isNaN(startMonth)) && !isCurrent) {
        return ValidationService.endDateAndCurrentValidator(startYear, startMonth, endYear, endMonth);
      } else {
        return null;
      }
    }
    return validator;
  }

  static minInserted(min: number) {
    const validator: ValidatorFn = (control: AbstractControl) => {
      const inserted = control.value as any[];
      const totalSelected = inserted.length;
      return totalSelected < min ? { minInserted: true } : null;
    };
    return validator;
  }

  static maxInserted(max: number) {
    const validator: ValidatorFn = (control: AbstractControl) => {
      const inserted = control.value as any[];
      const totalSelected = inserted.length;
      return totalSelected > max ? { maxInserted: true } : null;
    };
    return validator;
  }


  private static endDateAndCurrentValidator(startYear: number, startMonth: number, endYear: any, endMonth: any) {
    if (isNaN(endYear) && isNaN(endMonth)) {
      return { invalidEndDateOrCurrent: true };
    } else if (ValidationService.monthYearValidate(startMonth, startYear) && ((+startYear > +endYear) ||
      (+startMonth > +endMonth && +endYear === +startYear))) {
      return { afterEndDate: true };
    } else {
      return null;
    }
  }

  static invalidEndDateAndCurrent(endDateCtrName: string, isCurrentCtrName: string) {
    const validator: ValidatorFn = (control: AbstractControl) => {
      const group = control.parent as FormGroup;
      const endDate = group.get(endDateCtrName).value ? group.get(endDateCtrName).value.split('-') : null;
      const isCurrent = group.get(isCurrentCtrName).value;

      let endYear;
      let endMonth;

      if (endDate && endDate.length > 0) {
        endYear = endDate[0];
        endMonth = endDate[1];
      }

      if (isCurrent && (!isNaN(endYear) && !isNaN(endMonth))) {
        return { invalidEndDateAndCurrent: true };
      } else {
        return null;
      }
    }
    return validator;
  }

  static futureDate(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    const check = moment(control.value, dateFormate, true);
    if (!check.isValid()) {
      return { invalidDate: true }
    }
    const now = moment();
    if (check.diff(now, yearString, true) > 0) {
      return { futureDate: true }
    } else {
      return null;
    }
  }

  static pastYear(year: number) {
    const validator: ValidatorFn = (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }
      const val = control.value;
      const yearVal = val.split('-')[0];
      if (!isNaN(year)) {
        const curYear = new Date().getFullYear();
        return (curYear - yearVal) > year ? { invalidPastYear: true } : null;
      }
    };
    return validator;
  }

  static yearBefore(yearduration: number) {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }
      let day = null;
      let month = null;
      let year = null;
      const res = control.value.split('-');
      if (res.length > 1) {
        year = Number(res[0]);
        month = Number(res[1]) - 1;
        day = res[2] ? Number(res[2]) : 1;
      }
      if (!isNaN(day) && !isNaN(month) && !isNaN(year) && this.dayMonthYearValidate(month + 1, day, year)) {

        const now = new Date();
        const current = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const check = new Date(year, month, day);
        const diff = (current.getTime() - check.getTime()) / (1000 * 60 * 60 * 24 * 365);
        if (Math.floor(diff) < yearduration || this.checkBelowAgeLimit(year, month, day)) {
          return { invalidYearBefore: true };
        }
      }
      return null;
    };
  }

  static futureOrPresent(control: AbstractControl) {
    const now = new Date()
    now.setHours(0, 0, 0, 0);
    const selectedDate = new Date(control.value);
    selectedDate.setHours(0, 0, 0, 0);

    if (now > selectedDate) {
      return { futureOrPresent: true }
    }
    return null;
  }

  constructor() { }

  static passwordValidator(control) {
    if (control.value.match(/^[a-zA-Z0-9]*$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }
  static arrayEmpty(control) {
    const val = control.value as any[];
    if (val.length === 0) {
      return { arrayEmpty: true };
    }
    return null;
  }

  static passwordMatcher(control) {
    const changePasswordForm = control.parent;
    if (changePasswordForm.controls.newPassword.value === changePasswordForm.controls.confirmPassword.value) {
      return null
    } else {
      return { invalidMatchPassword: true }
    }
  }

  static matchPassword(passwordKey: string, passwordConfirmationKey: string) {
    return (control: AbstractControl) => {
      const group: FormGroup = control.parent as FormGroup;
      const passwordInput = group.controls[passwordKey];
      const passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return { invalidMatchPassword: true };
      } else {
        return null;
      }
    };
  }

  static minDateRangeValidator(startDate: string, endDate: string, minDateDiff: number) {

    return (control: AbstractControl) => {
      const group: FormGroup = control.parent as FormGroup;
      const sdate = new Date(group.controls[startDate].value);
      sdate.setHours(0, 0, 0, 0);
      const edate = new Date(group.controls[endDate].value);
      edate.setHours(0, 0, 0, 0);
      const dateDiffrentInTime = edate.getTime() - sdate.getTime();
      const dateDiffInDays = dateDiffrentInTime / (1000 * 3600 * 24)
      if (dateDiffInDays < minDateDiff) {
        return { minDateRangeValidator: true };
      }
    };
    return null;
  }

  static maxDateRangeValidator(startDate: string, endDate: string, maxDateDiff: number) {

    return (control: AbstractControl) => {
      const group: FormGroup = control.parent as FormGroup;
      const sdate = new Date(group.controls[startDate].value);
      sdate.setHours(0, 0, 0, 0);
      const edate = new Date(group.controls[endDate].value);
      edate.setHours(0, 0, 0, 0);
      const dateDiffrentInTime = edate.getTime() - sdate.getTime();
      const dateDiffInDays = dateDiffrentInTime / (1000 * 3600 * 24)
      if (dateDiffInDays > maxDateDiff) {
        return { maxDateRangeValidator: true };
      }
    };
    return null;
  }
  static maxFileSize(file: File, size: number) {
    const validator: ValidatorFn = (control: AbstractControl) => {
      if (!file) {
        return null;

      }
      return file.size > size && file.name === control.value ? { maxFileSize: true } : null;
    };
    return validator;
  }
  static mobileNumberValidator(control) {
    if (!control.value) {
      return null;
    }
    if (control.value.match(/^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/gi)) {
      return null;
    } else {
      return { invalidmobileNumber: true };
    }
  }
  static telephoneNumberValidator(control) {
    if (!control.value) {
      return null;
    }
    if (control.value.
      match(/^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?#(\d{4}|\d{3}))?$/gi)) {
      return null;
    } else {
      return { invalidtelephoneNumber: true };
    }
  }

  static customMaxRange(range: number) {
    const validator: ValidatorFn = (control: AbstractControl) => {
      if (control.value.length < range) {
        return null;
      }
      return control.value.length > range ? { range: true } : null;
    };
    return validator;
  }

  static endDateGraterthanEqualToStartDateValidator(startDate: string, endDate: string) {

    return (control: AbstractControl) => {
      const group: FormGroup = control.parent as FormGroup;
      const sdate = new Date(group.controls[startDate].value);
      sdate.setHours(0, 0, 0, 0);
      const edate = new Date(group.controls[endDate].value);
      edate.setHours(0, 0, 0, 0);
      const dateDiffrentInTime = edate.getTime() - sdate.getTime();
      const dateDiffInDays = dateDiffrentInTime / (1000 * 3600 * 24)
      if (dateDiffInDays < 0) {
        return { endDateGraterthanEqualToStartDateValidator: true };
      }
    };
    return null;
  }


  getValidatorErrorMessage(validatorName: string, validatorValue?: any, controlName?: string) {
    let errorMessage: string;

    switch (controlName) {
      case 'userName':
        errorMessage = 'Enter your username'
        break;
      case 'password':
        errorMessage = 'Enter your password'
        break;
      case 'existingPassword':
        errorMessage = 'Enter your current password'
        break;
      case 'newPassword':
        errorMessage = 'new password'
        break;
      case 'confirmPassword':
        errorMessage = 'Confirm your new password'
        break;
      case 'serverError':
        errorMessage = validatorValue
        break;
      default:
        errorMessage = 'Enter your'
    }



    const config = {
      required: errorMessage ? errorMessage : 'Required Field',
      invalidPassword: 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      minlength: `Please enter ${validatorValue.requiredLength} characters or more in `,
      maxlength: `Please enter ${validatorValue.requiredLength} characters or fewer in `,
      invalidMatchPassword: `New password and confirm new password must match`,
      pattern: `Enter a new password in the correct format, must only contain letters and/or numbers`,
      existingPassInvalid: `Confirm and enter your current password`,
      newPassUsedRecently: `New password has been used as a password recently, must be new`,
      incorrectUsername: `Confirm and enter your `,
      incorrectPassword: `Confirm and enter your `,
      newPasswordSameAsCurrent: `New password must be different to current password`,
      invalidniNumber: `Enter a valid`,
      email: `Enter a valid`,
      invalidDate: `Enter a valid`,
      isUnEmployed: `Please indicate 'I do not have any employment and work experience' or select 'Add new employment'`,
      employmentCheck: `Unselect, 'I do not have any employment and work experience' first, before selecting 'Add new employment'`,
      hasAddedValue: `I do not have any formal education' first, before selecting 'Add new education'.`
    };

    return config[validatorName];
  }

  setContext(context: any) {
    this.context = context;
  }

  getValidationMessageFromContext(validatorName: string, controlName: string) {
    return this.context[validatorName][controlName];
  }

  setFormServerErrors(error: any[]) {
    this.formValidator.emit(error);
  }

  static yearBeforeMax(yearduration: number) {
    return (control: AbstractControl) => {
      if (control.pristine || !control.value) {
        return null;
      }
      let day = null;
      let month = null;
      let year = null;
      const res = control.value.split('-');
      if (res.length > 1) {
        year = Number(res[0]);
        month = Number(res[1]) - 1;
        day = res[2] ? Number(res[2]) : 1;
      }
      if (!isNaN(day) && !isNaN(month) && !isNaN(year) && this.dayMonthYearValidate(month + 1, day, year)) {

        const now = new Date();
        const current = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const check = new Date(year, month, day);
        const diff = (current.getTime() - check.getTime()) / (1000 * 60 * 60 * 24 * 365);
        if (Math.floor(diff) > yearduration) {
          return { invalidMaxYearBefore: true };
        } else if (this.checkOverAgeLimit(year, month, day)) {
          return { invalidMaxYearBefore: true };
        }
      }
      return null;
    };
  }

  static checkOverAgeLimit(year, month, day) {
    return this.resolveDateRange(year, month, day, 100);
  }

  static resolveDateRange(year: any, month: any, day: any, yearDif: any) {
    const now = new Date();
    const yearDiff = now.getFullYear() - year;
    return ((now.getMonth() > month || (now.getMonth() === month && day < now.getDate()))
      && yearDiff === yearDif);
  }
  static checkBelowAgeLimit(year, month, day) {
    const now = new Date();
    const yearDiff = now.getFullYear() - year;
    return ((now.getMonth() < month || (now.getMonth() === month && day > now.getDate()))
      && yearDiff === 14);
  }

  static dateRangeAllowYear(yearduration: number) {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }
      const check = moment(control.value, dateFormate, true);
      if (!check.isValid()) {
        return { invalidDate: true };
      }
      const now = moment();
      if (check.diff(now, yearString, true) < 0) {
        return { invalidPastYear: true };
      }
      if (check.diff(now, yearString, true) > yearduration) {
        return { invalidDateRange: true };
      }
      return null;
    }
  }

  static validateAgeBelow18(yearduration: number) {
    return (control: AbstractControl) => {
      if (control.pristine || !control.value) {
        return null;
      }
      const check = moment(control.value, dateFormate, true);
      if (!check.isValid()) {
        return { invalidDate: true };
      }
      const now = moment();
      if (now.diff(check, yearString, true) > yearduration) {
        return { aboveDateRange: true }
      }
      return null;
    };
  }
}
