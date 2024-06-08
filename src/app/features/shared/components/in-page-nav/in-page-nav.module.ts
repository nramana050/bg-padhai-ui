import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InPageNavRoutingModule } from './in-page-nav-routing.module';
import { InPageNavComponent } from './in-page-nav.component';
import { InPageNavService } from './in-page-nav.service';
import { FeatureAllowModule } from '../../../../features/shared/components/directives/features-allow.module';
import { MaterialModule } from '../../../../../app/framework/material/material.module';

@NgModule({
  declarations: [InPageNavComponent],
  imports: [
    CommonModule,
    MaterialModule,
    InPageNavRoutingModule,
    FeatureAllowModule
  ],
  providers: [InPageNavService],
  entryComponents: [InPageNavComponent],
  exports: [InPageNavComponent]
})
export class InPageNavModule { }
