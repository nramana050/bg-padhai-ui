import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

export class FormUtil {

  private constructor() { }

  static clearAllValidatorsAndErrors(form: FormGroup): void {
    Object.keys(form.controls).forEach(name => {
      const control = form.get(name);
      control.clearValidators();
      control.setErrors(null);
      control.markAsTouched();
    });
  }

  static setValidators(form: FormGroup, validators: any): void {
    Object.keys(form.controls).forEach(name => {
      if (validators[name]) {
        const control = form.get(name);
        control.setValidators(validators[name]);
        control.updateValueAndValidity();
        control.markAsTouched();
      }
    });
  }

  static setErrormessageFromServers(form: FormGroup, errors: any[]) {
    
  }

}
