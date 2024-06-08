import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { AuthenticationGuard } from '../framework/guards/authentication.guard';
import { RouterModule, Routes } from '@angular/router';
import { PageTitleIdentifier } from '../framework/constants/PageTitleIdentifier-constants';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'home'},
    children : [
      {
        path: 'padhai', loadChildren:() => import('../features/padhai/padhai.module').then(m => m.padhaiModule),
        data: { title: 'PADHAI', breadcrumb: '', preload: false,  identifier:PageTitleIdentifier.PADHAI}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
