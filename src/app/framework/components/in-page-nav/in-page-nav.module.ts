import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InPageNavRoutingModule } from './in-page-nav-routing.module';
import { InPageNavComponent } from './in-page-nav.component';
import { InPageNavService } from './in-page-nav.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [InPageNavComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    InPageNavRoutingModule,
    // FeatureAllowModule
  ],
  providers: [InPageNavService],
  entryComponents: [InPageNavComponent],
  exports: [InPageNavComponent]
})
export class InPageNavModule { }
