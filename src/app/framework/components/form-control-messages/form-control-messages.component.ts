import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControlDirective, FormControlName, FormControl } from '@angular/forms';
import { ValidatorService } from './validator.service';


@Component({
  selector: 'app-control-messages',
  template: `
    <ng-container *ngIf="control.touched && control.invalid && errorServerMessage===null" class="error-msg" tabindex="0">
      {{errorMessage}}
    </ng-container>
    <ng-container *ngIf="control.invalid && errorServerMessage !== null" class="error-msg" tabindex="0">
      {{errorServerMessage}}
    </ng-container>
    `
})
export class FormControlMessagesComponent {
  @Input() control: FormControl;
  @Input() name: string;

  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return ValidatorService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }

  get errorServerMessage() {
    if (this.control.errors != null && this.control.errors.hasOwnProperty('errorMessage')) {
      return this.control.errors['errorMessage'];
    }
    return null;
  }

}