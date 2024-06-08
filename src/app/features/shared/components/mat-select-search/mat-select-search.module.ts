/**
 * Based on ngx-mat-select-search
 * https://github.com/bithost-gmbh/ngx-mat-select-search
 * Copyright (c) 2018 Bithost GmbH All Rights Reserved.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectSearchComponent } from './mat-select-search.component';
import { MatSelectSearchClearDirective } from './mat-select-search-clear.directive';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  declarations: [
    MatSelectSearchComponent,
    MatSelectSearchClearDirective
  ],
  exports: [
    MatSelectSearchComponent,
    MatSelectSearchClearDirective
  ]
})
export class MatSelectSearchModule { }
