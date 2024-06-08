import { Pipe, PipeTransform } from '@angular/core';
import { Utility } from '../utils/utility';

@Pipe({
  name: 'getLabel'
})
export class GetLabelPipe implements PipeTransform {

  transform(value: any, ...args: any): any {

    let name = Utility.getObjectFromArrayByKeyAndValue(args[0], 'id', args[1]);

    if (name) {

      let nameStr = name[`${args[2]}`];
      switch (args[3]) {
        case 'qualificationCode':
          return `${nameStr} (${name[`${args[3]}`]})`;
        default:
          return nameStr;
      }
    }
    return 'N/A';
  }

}
