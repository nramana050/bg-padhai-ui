import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { ValidationService } from '../validation.service';

export interface Errors {
  key: string,
  message: string,
}

@Component({
  selector: 'vc-all-errors',
  templateUrl: './all-errors.component.html',
  styleUrls: ['./all-errors.component.scss']
})
export class AllErrorsComponent implements OnInit {

  @Input() groups: FormGroup[];
  @Input() fromContext: boolean = false;
  @Input() topLabel: string;
  @Input() topLabelLink: string;
  @Input() topLabelAction: Function = () => {};
  @Input() isDirect: boolean = false;
  @Input() errorList: Errors[] = [];
  @Input() id: any;

  _errors: any = {};

  constructor(private readonly validationService: ValidationService) { }

  ngOnInit() { }

  get errors() {
    if (!this.isDirect) {
      this._errors = {};
      this.groups.forEach(g => {
        Object.keys(g.controls).forEach(key => {
          const ctr = g.get(key);
          this.addIfInvalid(ctr, this._errors, key);
        });
      });
    }
    return this._errors;
  }

  private addIfInvalid(ctr: AbstractControl, errors: any, key: string) {
    if (!ctr.valid && !ctr.disabled && !(ctr instanceof FormGroup)) {
      if (ctr.parent.parent instanceof FormArray) {
        const farr = ctr.parent.parent;
        const i = farr.controls.indexOf(ctr.parent);
        const message = key === 'answers' ? ctr.parent.get('question').value : this.errorMessage(ctr, key);
        errors[Object.keys(errors).length + 1] = { 'key': key, 'message': message, index: i };
      } else {
        errors[Object.keys(errors).length + 1] = { 'key': key, 'message': this.errorMessage(ctr, key) };
      }
    }
  }

  errorMessage(ctr: AbstractControl, key: string): string {
    for (const propertyName in ctr.errors) {
      if (ctr.errors.hasOwnProperty(propertyName) && (ctr.touched || ctr instanceof FormArray)) {
        if(propertyName === 'serverError'){
          return this.validationService.getValidatorErrorMessage('required',ctr.errors[propertyName], propertyName);
        }else{
        return this.fromContext
          ? this.validationService.getValidationMessageFromContext(propertyName, key) 
          : this.validationService.getValidatorErrorMessage(propertyName, ctr.errors[propertyName]);
        }
      }
    }
    return null;
  }

  get indexes() {
    return Object.keys(this.errors);
  }

  getMessage(index: any): string {
    const error = this.errors[index];
    return error.message;
  }

  getKey(index: any): string {
    const error = this.errors[index];
    return error.key;
  }

  getError(index: any): any {
    return this.errors[index];
  }

  goToId(error: any) {
    const id = error.index !== undefined ? 'id-' + error.key + '-' + error.index : 'id-' + error.key;
    if (document.getElementById(id).tagName === 'INPUT') {
      document.getElementById(id).focus();
    } else if (document.getElementById(id).getElementsByTagName('input').length > 0) {
      document.getElementById(id).getElementsByTagName('input')[0].focus();
    } else if (document.getElementById(id).tagName === 'TEXTAREA') {
      document.getElementById(id).focus();
    } else if (document.getElementById(id).tagName === 'A') {
      document.getElementById(id).focus();
    } else if (document.getElementById(id).tagName === 'SELECT') {
      document.getElementById(id).focus();
    } else if (document.getElementById(id).getElementsByTagName('button').length > 0) {
      document.getElementById(id).getElementsByTagName('button')[0].focus();
    } else {
      document.querySelector('#' + id).scrollIntoView();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }

}
