import { Injectable, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INotification } from './notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly notificationSubject = new BehaviorSubject<INotification>(null);
  currentNotification = this.notificationSubject.asObservable();
  autoHideDuration = 12000;
  timeout: any;

  constructor() { }

  error(message: INotification['message'], autoHide?: boolean) {
    let excludeErrorMessage = false;
    for (const singleMessage of message) {
      if (
        singleMessage === 'Password does not match with existing password.' ||
        singleMessage === 'Password is the same as your current password, please change it.' ||
        singleMessage === 'Password has been used already, please choose another.' ||
        singleMessage === 'Incorrect user credentials, log in failed.' ||
        singleMessage === 'You are not authorized to perform the task.' ||
        singleMessage === 'You are not authorised to perform this operation.' ||
        singleMessage === 'No Plan has been created.'
      ) {
        excludeErrorMessage = true;
      }
    }
    if (!excludeErrorMessage) {
      this.notify('error', message, autoHide);
    }
  }

  success(message: INotification['message'], autoHide?: boolean) {
    this.notify('success', message, autoHide);
  }

  close() {
    this.notificationSubject.next(null);
  }

  private notify(type: INotification['type'], message: INotification['message'], autoHide?: boolean) {

    const notification: INotification = {
      message,
      type
    };

    this.notificationSubject.next(notification);
    if (autoHide) {
      setTimeout(() => this.close(), this.autoHideDuration);
    }
    
  }
}
