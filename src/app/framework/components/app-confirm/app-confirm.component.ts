import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm',
  template: `
      <h3 matDialogTitle id="title">{{ data.title }}</h3>

      <div mat-dialog-content id="message">
        <p>{{ data.message }}</p>
      </div>

      <div class="dialog-form-field" [formGroup]="dialogForm">
        <mat-form-field appearance="outline" *ngIf="data.showTextField">
          <mat-label>{{ data.placeholderTextField }} </mat-label>
          <input matInput #inputReason [(ngModel)]="inputReasonTxt" id="text_field" required formControlName="reason">
        </mat-form-field>

        <mat-form-field appearance="outline" *ngIf="data.showSelectField">
          <mat-label>{{ data.placeholderSelectField }} </mat-label>
          <mat-select #selectReason [(ngModel)]="selectReasonOption" required id="select" formControlName="reason">
            <mat-option *ngFor="let option of data.optionsSelectField" [value]="option.id" id="{{option.id}}">
              {{option.reason}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-radio-group class="radio-group" *ngIf="data.showSelectRadioButtons" 
        [(ngModel)]="selectRadioButtonOption" id="select" formControlName="radiobutton">
          <mat-radio-button class="radio-button" *ngFor="let option of data.optionsSelectRadioButton" 
          (change)="dialogRef.close(option)" [disabled]="(data.preSelectedRadioButtonOption === option)? true : false"
           [value]="option"> {{option | titlecase}} </mat-radio-button>
        </mat-radio-group>

        <mat-form-field appearance="outline" *ngIf="data.showTextAreaField">
          <mat-label>{{ data.placeholderTextAreaField }} </mat-label>
          <textarea matInput #textAreaReason [(ngModel)]="inputReasonTxtArea" id="text_area_field" required rows="3" 
          formControlName="reason" minlength="1">
          </textarea>
          <mat-error *ngIf="dialogForm.controls.reason.invalid && !dialogForm.controls.reason.errors?.pattern && 
              !dialogForm.controls.reason.errors?.minlength && !dialogForm.controls.reason.errors?.maxlength">
              Response is required
            </mat-error>
          <mat-error *ngIf="dialogForm.controls.reason.errors?.minlength || 
          dialogForm.controls.reason.value?.length > 400 ">
              Minimum 1 and maximum 400 characters allowed
          </mat-error>
          <mat-hint
          *ngIf="dialogForm.controls.reason.invalid && !dialogForm.controls.reason.value ">
          Minimum 1 and maximum 400 characters allowed
          </mat-hint>
          <mat-hint
          *ngIf="dialogForm.controls.reason.valid && dialogForm.controls.reason.value.length ==  (400-1) && dialogForm.controls.reason.value.length !=  (400) ">
          {{400 - dialogForm.controls.reason.value.length}} character left
          </mat-hint>
          <mat-hint
          *ngIf="dialogForm.controls.reason.valid && (400) >= dialogForm.controls.reason.value.length && (400-1) != dialogForm.controls.reason.value.length ">
          {{400 - dialogForm.controls.reason.value.length}} characters left
        </mat-hint>
        </mat-form-field>
      </div>

      <div mat-dialog-actions style="display:flex; margin: 24px 0 12px 0;">
        <button type="button" *ngIf="!data.showOkButtonOnly" color="primary" mat-stroked-button (click)="dialogRef.close(false)" id="{{data.cancelButtonName}}">
        {{data.cancelButtonLabel}}</button>
        <span style="flex: 1 1 auto;"></span>
        <button *ngIf="data.showSelectField" [disabled]="!selectReasonOption"
        type="button" mat-stroked-button color="accent" (click)="dialogRef.close(selectReasonOption)" id="{{data.okButtonName}}">
        {{data.okButtonLabel}}</button>
        <button *ngIf="data.showTextField" [disabled]="!inputReasonTxt"
        type="button" mat-stroked-button color="accent" (click)="dialogRef.close(inputReasonTxt)" id="{{data.okButtonName}}">
        {{data.okButtonName}}</button>
        
        <button *ngIf="data.showTextAreaField" [disabled]="dialogForm.controls.reason.invalid"
        type="button" mat-stroked-button color="accent" (click)="dialogRef.close(inputReasonTxtArea)" id="{{data.okButtonName}}">
        {{data.okButtonName}}</button>
        <button *ngIf="data.showSelectRadioButtons" [disabled]="dialogForm.controls.radiobutton.invalid"
        type="button" mat-stroked-button color="accent" (click)="dialogRef.close(selectRadioButtonOption)" id="{{data.okButtonName}}">
        {{data.okButtonLabel}}</button>
        <button *ngIf="!data.showTextField && !data.showSelectField && !data.showTextAreaField && !data.showSelectRadioButtons"
        type="button" mat-stroked-button color="accent" (click)="dialogRef.close(true)" id="{{data.okButtonName}}">
        {{data.okButtonLabel}}</button>
        &nbsp;
      </div>
    `,
  styles: [
    `
      h3 {color: #e6650f; font-size: 1.6em; font-weight: 100;}
      .dialog-form-field {display:flex; flex-direction: column; width: 100%;}

      .radio-group {
        display: flex;
        flex-direction: column;
      }

      .radio-button {
        margin: 5px;
      }
      `
  ]
})

export class AppConfirmComponent {
  dialogForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AppConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly fb: FormBuilder,

  ) { 
    this.dialogForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(400)]],
      radiobutton: ['',],
    });
    document.getElementsByClassName('mat-dialog-container')[0]['style'].padding = data.padding;
  }


}
