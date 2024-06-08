import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ChangePasswordComponent } from './change-password/change-password.component';
import { CanDeactivateGuard } from '../../framework/guards/can-deactivate/can-deactivate.guard';
import { OAuthGuard } from 'src/app/framework/guards/oauth.guard';

const routes: Routes = [
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    data: { title: 'Change Password'},
    canActivate:[OAuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingsRoutingModule { }
