import { ValidationService } from './../validation.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'vc-date-form-control',
  styleUrls: ['./date-form-control.component.scss'],
  template: `<div id="id-section-{{controlName}}" class="gds-form-group border-box"
              [ngClass]="{'form-group-error': errorMessage !== null}">
              <label class="form-label-b19" for="id-{{controlName}}"> {{label}} <span>{{optional}}</span></label>
              <div *ngIf="errorMessage !== null" id="id-section-error-{{controlName}}" data-validation-error=""
                  class="form-error error-message">{{errorMessage}} <span *ngIf="!fromContext">{{label | lowercase}}</span></div>
              <div *ngIf="errorMessage === null && hint" id="id-section-help-{{controlName}}" class="form-hint">{{hint}}</div>
              <div class="form-control-wrap">
                  <label class="form-label " for="id-day-{{controlName}}"> Day </label>
                  <input [(ngModel)]="day" [ngClass] = "{'errorfocus': control?.errors }" class="form-control " type="text" 
                    maxLength="2" minLength="1" id="id-day-{{controlName}}" name="day" (change)="update()"
                    aria-describedby="id-section-help-day id-section-error-day">
              </div>
              <div class="form-control-wrap">
                  <label class="form-label" for="id-month-{{controlName}}"> Month </label>
                  <input [(ngModel)]="month" [ngClass] = "{'errorfocus': control?.errors }" class="form-control " type="text" 
                    maxLength="2" minLength="2" id="id-month-{{controlName}}" name="month" (change)="update()"
                    aria-describedby="id-section-help-month id-section-error-month">
              </div>
              <div class="form-control-wrap yearInput">
                  <label class="form-label" for="id-year-{{controlName}}"> Year </label>
                  <input [(ngModel)]="year" [ngClass] = "{'errorfocus': control?.errors }" class="form-control" type="text" 
                    maxLength="4" minLength="4" id="id-year-{{controlName}}" name="year" (change)="update()"
                    aria-describedby="id-section-help-year id-section-error-year">
              </div>
            </div>`
})
export class DateFormControlComponent implements OnChanges, OnInit {

  day: string = '';
  month: string = '';
  year: string = '';

  @Input() control: FormControl;
  @Input() label: string;
  @Input() optional: string;
  @Input() hint: string;
  @Input() controlName: string;
  @Input() fromContext: boolean = false;

  changeSub: Subscription;

  constructor(private readonly validationService: ValidationService) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    this.resolveInitialDate();
    if (this.changeSub) {
      this.changeSub.unsubscribe();
    }

    if(this.control){
      this.changeSub = this.control.valueChanges.subscribe(value => {
        if (value) {
          this.resolveInitialDate();
        };
      });
    }
   
  }

  update() {
    this.control.markAsDirty();
    let dob = null;
    if (this.day || this.month || this.year) {
      dob = `${this.parseToLen(this.year, 4)}-${this.parseToLen(this.month, 2)}-${this.parseToLen(this.day, 2)}`;
    }
    this.control.setValue(dob);
  }

  parseToLen(target: string, len: number): string {
    if (target && ('' + target).length < len) {
      let val = '';
      for (let i = 0; i < (len - ('' + target).length); i++) {
        val = val + '0';
      }
      return val + target;
    }
    return target;
  }

  resolveInitialDate() {
    const dob = this.control ? this.control.value : null;
    if (dob) {
      this.year = dob.split('-')[0] !== 'null' ? dob.split('-')[0] : null;
      this.month = dob.split('-')[1] !== 'null' ? dob.split('-')[1] : null;
      this.day = dob.split('-')[2] !== 'null' ? dob.split('-')[2] : null;
    } else {
      this.year = '';
      this.month = '';
      this.day = '';
    }
  }

  get errorMessage(): string {
    if(this.control){
      for (const propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
          return this.fromContext
            ? this.validationService.getValidationMessageFromContext(propertyName, this.controlName)
            : this.validationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
        }
      }
    }
    return null;
  }

}