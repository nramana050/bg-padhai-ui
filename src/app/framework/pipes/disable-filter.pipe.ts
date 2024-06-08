import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({
    name: 'disableFilter'
})
@Injectable()
export class DisableFilterPipe implements PipeTransform {
    transform(element: any, field: string, value: string): any {

        if( field == 'preview' && element.courseStatus == 'Asset'){
            
            return element.assetStatus == 'Generated' ? false : true;
        }

        if (field == 'Retry' && element.courseStatus == 'Lesson' && element.lessonStatus == 'Generated') {
            return true;
        }

        if (field == 'Retry' && element.courseStatus == 'Outline' && element.outlineStatus == 'Generated') {
            return true;
        }

        if(field == 'delete' && element.outlineStatus == 'In Progress' || element.lessonStatus == 'In Progress' || element.assetStatus == 'In Progress' || element.publishStatus == 'In Progress' || element.outcomeStatus == 'In Progress' ){
            return true; 
        }
        
        switch (element.courseStatus) {

            case 'Outline':
                if (element.outlineStatus == 'Generated') {
                    return field == 'preview' ? true : false;
                } else if (element.outlineStatus == 'Failed' && field == 'delete'){
                    return false
                }
                else{
                    return true;
                }                              
            case 'Lesson':
                if (element.lessonStatus == 'Generated') {
                    return field == 'preview' ? true : false;
                } else if (element.lessonStatus == 'Failed' && field == 'delete'){
                    return false
                }
                else{
                    return true;
                }
            case 'Asset' : 
                if (element.assetStatus == 'Generated') {
                    return field == 'preview' ? true : false;
                } else if (element.assetStatus == 'Failed' && field == 'delete'){
                    return false
                }
                else{
                    return true;
                }
                   
            case 'Publish':
                if (element.publishStatus == 'Generated') {
                    return field == 'preview' || field == 'delete' ? false : true;
                } else if (element.publishStatus == 'Failed' && field == 'delete'){
                    return false
                }
                else{
                    return true;
                }
                case 'Outcome':
                if (element.outcomeStatus == 'Generated') {
                    return field == 'preview' || field == 'delete' ? false : true;
                } else if (element.outcomeStatus == 'Failed' && field == 'delete'){
                    return false
                }
                else{
                    return true;
                }
            default:
                return element;
        }
    }
}
