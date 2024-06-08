import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageViewerModule } from 'ngx-image-viewer';
import { ImagePickerComponent } from './image-picker.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [
    ImagePickerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ImageViewerModule.forRoot()
  ],
  exports: [
    ImagePickerComponent
  ],
  providers:[ {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {floatLabel: 'always'}}  ]
})
export class ImagePickerModule { }
