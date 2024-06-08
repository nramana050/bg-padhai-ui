import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxComponent } from './confirm-box.component';
import { ConfirmService } from './confirm-box.service';

@NgModule({
  declarations: [
    ConfirmBoxComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ConfirmBoxComponent
  ],
  providers: [
    ConfirmService
  ]
})
export class ConfirmBoxModule { }
