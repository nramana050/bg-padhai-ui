import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ValidationService } from '../validation.service';

@Component({
	selector: 'vc-month-form-control',
	styleUrls: ['./date-form-control.component.scss'],
	template: `<div id="id-section-{{controlName}}" class="gds-form-group border-box"
                [ngClass]="{'form-group-error': errorMessage !== null}">
                <label class="form-label-b19" for="id-{{controlName}}"> {{label}} <span>{{optional}}</span></label>
                <div *ngIf="errorMessage !== null" id="id-section-error-{{controlName}}" data-validation-error=""
                    class="form-error error-message">{{errorMessage}} <span *ngIf="!fromContext">{{label | lowercase}}</span></div>
                <div *ngIf="errorMessage === null && hint" id="id-section-help-{{controlName}}" class="form-hint">{{hint}}</div>
                <div class="form-control-1-16">
                    <label class="form-label" for="id-month-{{controlName}}"> Month </label>
					<input [(ngModel)]="month" [ngClass] = "{'errorfocus': control?.errors }" class="form-control form-control-1-1" type="string" 
					  onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                      maxLength="2" minLength="2" id="id-month-{{controlName}}" name="month" (change)="update()" [disabled]="control.disabled"
                      aria-describedby="id-section-help-month id-section-error-month">
                </div>
                <div class="form-control-1-10">
                    <label class="form-label" for="id-year-{{controlName}}"> Year </label>
                    <input [(ngModel)]="year" [ngClass] = "{'errorfocus': control?.errors }" class="form-control form-control-1-1" type="string" 
					  onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                      maxLength="4" minLength="4" id="id-year-{{controlName}}" name="year" (change)="update()" [disabled]="control.disabled"
                      aria-describedby="id-section-help-year id-section-error-year">
                </div>
              </div>`
})
export class MonthFormControlComponent implements OnChanges, OnInit {

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
		this.resolveInitialMonthYear();
		if (this.changeSub) {
			this.changeSub.unsubscribe();
		}
		this.changeSub = this.control.valueChanges.subscribe(value => {
			if (value) {
				this.resolveInitialMonthYear();
			}
		});
	}

	update() {
		this.control.markAsDirty();
		let dob = null;
		if (this.month || this.year) {
			dob = `${this.parseToLen(this.year, 4)}-${this.parseToLen(this.month, 2)}`;
		}
		this.control.setValue(dob);
	}

	resolveInitialMonthYear() {
		const dob = this.control.value;
		if (dob) {
			this.year = dob.split('-')[0] !== 'null' ? dob.split('-')[0] : null;
			this.month = dob.split('-')[1] !== 'null' ? dob.split('-')[1] : null;
		} else {
			this.year = '';
			this.month = '';
		}
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


	get errorMessage(): string {
		for (const propertyName in this.control.errors) {
			if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
				return this.fromContext
					? this.validationService.getValidationMessageFromContext(propertyName, this.controlName)
					: this.validationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
			}
		}
		return null;
	}

}