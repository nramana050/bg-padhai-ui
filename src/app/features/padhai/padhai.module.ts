import { NgModule } from '@angular/core';
import { ContentGeneratorComponent } from './content-generator/content-generator.component';
import { PadhaiRoutingModule } from './padhai-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { AddContentCourseComponent } from './add-course/add-content-course.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { EditContentComponent } from './edit-content/edit-content.component';
import { PreviewCourseComponent } from './preview-course/preview-course.component';
import { TranslatePopupComponent } from './translate-popup/translate-popup.component';
import { NewPreviewComponent } from './edit-content/new-preview/new-preview.component';
import { LearningOutcomesComponent } from './learning-outcomes/learning-outcomes.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    ContentGeneratorComponent,
    AddContentCourseComponent,
    EditContentComponent,
    PreviewCourseComponent,
    NewPreviewComponent,
    TranslatePopupComponent,
    LearningOutcomesComponent
  ],
  
  imports: [ 
    CommonModule,
    PadhaiRoutingModule,
    MatCardModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule, 
    FilterPipeModule,
    CKEditorModule
   
   ],
})
export class padhaiModule { }