import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationGuard } from './framework/guards/authentication.guard';
import { StepperNavigationModule } from './features/shared/components/stepper-navigation/stepper-navigation.module';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SharedModule } from './framework/shared/shared.module';
import { MaterialModule } from './framework/material/material.module';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipeModule } from './framework/pipes/filter.module';
import { OktaAuth } from '@okta/okta-auth-js';
// import { ConfigService } from './sessions/ConfigService';
import { OktaAuthModule } from '@okta/okta-angular';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StepperNavigationModule,
    TranslateModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    SharedModule,
    MaterialModule,
    FormsModule,
    FilterPipeModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {}
}