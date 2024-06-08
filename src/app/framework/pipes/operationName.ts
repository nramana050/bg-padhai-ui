import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getOperationName'
})
export class OperationNamePipe implements PipeTransform {

  transform(operationId: any, ...args: any): any {
    if(operationId){

        let operation = args[0].filter( operation => operation.id == Number(operationId.substr(2)));
        return operation[0] ? operation[0].value : `${operationId}`;
    }
  }
}