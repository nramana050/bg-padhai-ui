import { NgModule } from '@angular/core';
import { FilterPipe } from './filter.pipe';
import { SafePipe } from './safe.pipe';
import { TruncatePipe } from './truncate.pipe';
import { GetLabelPipe } from './get-label.pipe';
import { DisableFilterPipe } from './disable-filter.pipe';
import { StatusFilterPipe } from './statusFilter.pipe';
import { OperationNamePipe } from './operationName';
import { CustomMonthFormatPipe } from './custom-month-format-pipe';
@NgModule({
  declarations: [FilterPipe, SafePipe, TruncatePipe, GetLabelPipe, DisableFilterPipe, StatusFilterPipe, OperationNamePipe,CustomMonthFormatPipe],
  exports: [FilterPipe, SafePipe, TruncatePipe, GetLabelPipe, DisableFilterPipe, StatusFilterPipe, OperationNamePipe,CustomMonthFormatPipe]
})

export class FilterPipeModule { }
