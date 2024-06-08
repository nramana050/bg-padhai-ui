import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditContentComponent } from './edit-content/edit-content.component';
import{ ContentGeneratorComponent }from './content-generator/content-generator.component';
import { AddContentCourseComponent } from './add-course/add-content-course.component';
import { PreviewCourseComponent } from './preview-course/preview-course.component';
import { CanDeactivateGuard } from 'src/app/framework/guards/can-deactivate.guard';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
const routes: Routes = [
  {
    path:'',
    component:ContentGeneratorComponent,
    data: { title : 'padhai' },
  },
  {
    path:'add',
    component:AddContentCourseComponent,
    data: { identifier:PageTitleIdentifier.PADHAI},
  },
  {
    path : 'edit-content/:id',
    component : EditContentComponent,
    canDeactivate: [CanDeactivateGuard],
    data: { title : 'Edit Course' , identifier:PageTitleIdentifier.Edit_Padhai},
  },
  {
    path : 'preview-content/:id',
    component : PreviewCourseComponent,
    data: { title : 'Preview Course' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PadhaiRoutingModule { }
