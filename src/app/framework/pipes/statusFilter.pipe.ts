import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({
    name: 'statusFilter'
})
@Injectable()
export class StatusFilterPipe implements PipeTransform {
    transform(element: any, field: string, value: string): any {

        switch (element.courseStatus) {
            case 'Outline':
                if( element.outlineStatus == 'In Progress'){
                    return `${element.courseStatus} Generation In Progress`;  
                }
                if(element.outlineStatus == 'Failed'){
                    return `${element.courseStatus} Regeneration Needed`; //Generation ${element.outlineStatus}
                }
                return `${element.courseStatus} ${element.outlineStatus}`;
            case 'Lesson':
                if(element.lessonStatus == 'In Progress'){
                    return `${element.courseStatus} Generation In Progress`;  
                }
                if(element.lessonStatus == 'Failed'){
                    return `${element.courseStatus}s Regeneration Needed`; //Generation ${element.lessonStatus}
                } 
                return `${element.courseStatus}s ${element.lessonStatus}`;
            case 'Outcome':
                if(element.outcomeStatus == 'In Progress'){
                    return `${element.courseStatus} Generation In Progress`;  
                }
                if(element.outcomeStatus == 'Failed'){
                    return `${element.courseStatus} Regeneration Needed`; //Generation ${element.outcomeStatus}
                } 
                return `${element.courseStatus} ${element.outcomeStatus}`;
            case 'Asset':
                if(element.assetStatus == 'In Progress'){
                    return `${element.courseStatus} Generation In Progress`;  
                }
                if(element.assetStatus == 'Failed'){
                    return `${element.courseStatus}s Regeneration Needed`; //Generation ${element.assetStatus}
                }
                return `Ready for Export`;
            case 'Publish':
                if(element.publishStatus == 'Generated'){
                    return `Course Ready`;
                }
                return `${element.courseStatus} ${element.publishStatus}`;
            default:
                return element;
        }
    }
}
