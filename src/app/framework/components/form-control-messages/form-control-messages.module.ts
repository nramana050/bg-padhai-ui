import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlMessagesComponent } from './form-control-messages.component';
import { ValidateFormDirective } from './validate-form.directive';
import { MaterialModule } from '../../material/material.module';



@NgModule({
  declarations: [FormControlMessagesComponent, ValidateFormDirective],
  imports: [
    CommonModule, MaterialModule
  ],
  exports: [FormControlMessagesComponent, ValidateFormDirective]
})
export class FormControlMessagesModule { }
