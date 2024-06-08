import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageViewComponent } from './image-viewer.component';
import { ImageViewerModule } from 'ngx-image-viewer';
import { MaterialModule } from '../../../../framework/material/material.module';

@NgModule({
  declarations: [
    ImageViewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ImageViewerModule.forRoot()
  ],
  exports: [
    ImageViewComponent
  ]
})
export class ImageViewModule { }
