import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../framework/material/material.module';
import { SharedModule } from '../../framework/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsService } from './user-settings.service';
import { AppService } from './../shared/services/app.service';

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    UserSettingsRoutingModule
  ],
  providers: [UserSettingsService, AppService]
})
export class UserSettingsModule { }



