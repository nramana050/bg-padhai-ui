import { Component, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';
import { INotification } from './notification.interface';

@Component({
  selector: 'vc-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notification: INotification;

  constructor(private readonly notificationService: NotificationService) {
  }

  ngOnInit() {
    this.notificationService.currentNotification.subscribe(
      notification => {
        this.notification = notification;
        if (notification) {
          setTimeout( () => {
            document.getElementById('error-summary').focus();
          })
        }
      });
  }

  onClose() {
    this.notificationService.close();
  }
}
