import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperNavigationComponent } from './stepper-navigation.component';
import { StepperNavigationService } from './stepper-navigation.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../framework/material/material.module';

@NgModule({
  declarations: [StepperNavigationComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MaterialModule,
    TranslateModule,
    RouterModule
  ],
  providers: [StepperNavigationService],
  entryComponents: [StepperNavigationComponent],
  exports: [ StepperNavigationComponent ]
})
export class StepperNavigationModule { }
