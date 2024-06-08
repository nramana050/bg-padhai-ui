import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class CommunicationService {
    
    dataServiceSubject = new Subject<any>();
    newImageUploadedSubject = new BehaviorSubject<boolean>(false);
    courseImageSubject = new Subject<any>();
    courseOutlineSuccessSubject = new Subject<any>();
}