import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Injectable } from "@angular/core";

@Injectable()
export class AppDateAdapter extends MomentDateAdapter {

  parse(value: any, parseFormat: any) {
    if (value) {
      moment.locale('en-gb');
      return moment(value, parseFormat);
    }
    return null;
  }
}

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: ['L', 'LL'],
  },
  display: {
    dateInput: 'DD MMMM YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'Y'
  }
};
