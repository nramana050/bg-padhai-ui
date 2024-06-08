import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopnavComponent } from './topnav/topnav.component';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../framework/material/material.module';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { NgModule } from '@angular/core';
import { SharedModule } from '../framework/shared/shared.module';
import { BreadcrumbComponent } from '../framework/components/breadcrumb/breadcrumb.component';
import { InPageNavModule } from '../framework/components/in-page-nav/in-page-nav.module';
import { HomeRoutingModule } from './home-routing.module';
// import { ChatnotificationComponent } from './topnav/chatnotification/chatnotification.component';
// import { ChatNotificationMatBadgeService } from './topnav/chatnotification/chatnotification-matbadge.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        NgHttpLoaderModule.forRoot(),
        // HttpRequestInterceptorModule,
        HomeRoutingModule,
        InPageNavModule,
        SharedModule
    ],
    declarations: [
        HomeComponent, 
        TopnavComponent, 
        SidebarComponent, 
        BreadcrumbComponent,
        // ChatnotificationComponent
    ],
    providers: [
        // ChatNotificationMatBadgeService, 
        InPageNavModule
    ],
})
export class HomeModule {}
