import { Component, OnInit, HostListener, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Subscription, Observable, timer } from 'rxjs';
// import { SessionsService } from '../sessions/sessions.service';
// import { UserActivityService } from '../sessions/user-activity/user-activity.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  private timerSubscription: Subscription;
  private timer: Observable<number>;
  private isDialogOpen = false;
  showLoader = true;
  constructor(
    // private readonly sessionsService: SessionsService,
    // private readonly userActivityService: UserActivityService,
    private readonly zone: NgZone,
    private router: Router,
    private readonly renderer: Renderer2
  ) { 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showLoader = event.url.includes('/padhai/edit-content/') ? false : true;
      }
    });
  }

  ngOnInit() {

    // this.userActivityService.lastActivity = new Date().getTime();
    // this.zone.runOutsideAngular(() => {
    //   if (this.timerSubscription) {
    //     this.timerSubscription.unsubscribe();
    //   }
    //   this.startTimer();
    // });
    this.changeDarkMode();
  }

  @HostListener('document:keyup')
  @HostListener('document:click')
  @HostListener('document:wheel')

  setUserLastActivity() {
    // this.userActivityService.lastActivity = new Date().getTime();
  }

  resolveSessionParams() {
    let sessionParams;
    if (localStorage.getItem('session')) {
      sessionParams = JSON.parse(atob(localStorage.getItem('session')));
    }
    else {
      sessionParams = { 'idleTime': 1200, 'inactiveNotificationTime': 120, 'heartbeat': 60 };
    }
    return sessionParams;
  }

  startTimer() {

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    const sessionParams = this.resolveSessionParams();
    this.timer = timer(0, 60 * 1000);
    this.timerSubscription = this.timer.subscribe(n => {
      // localStorage.setItem('lastActivity', '' + this.userActivityService.lastActivity);

      if ((new Date().getTime() - +localStorage.getItem('lastActivity')) / 1000 >
        (sessionParams.idleTime - sessionParams.inactiveNotificationTime) &&
        !this.isDialogOpen) {

        this.isDialogOpen = true;

        // this.zone.run(() => {
        //   this.userActivityService.openCountdownWarning(sessionParams.inactiveNotificationTime)
        //     .subscribe(
        //       result => {
        //         this.isDialogOpen = false;

        //         if (result) {
        //           this.userActivityService.lastActivity = new Date().getTime();
        //         } else {
        //           localStorage.removeItem('lastActivity');
        //           this.timerSubscription.unsubscribe();
        //           this.sessionsService.signout().subscribe();
        //           return;
        //         }
        //       }
        //     );
        // });
      }
      this.sendHeartbeat(n, sessionParams.heartbeat)
    });
  }
  sendHeartbeat(time, heartbeat) {
    // if (time * 60 % heartbeat === 0) {
    //   this.userActivityService.checkHeartbeat().subscribe(
    //     response => {
    //       if (response.isRefreshRequred === true) {
    //         this.sessionsService.refreshToken().subscribe();
    //       }
    //     }
    //   );
    // }
  }
  
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  changeDarkMode() {
    let url = window.location.href;
    if(url.includes('mentivisestaff')){
      this.renderer.addClass(document.body, 'customdarkMode');
    } else if (url.includes('myunity')){
      this.renderer.addClass(document.body, 'customdarkMode');
      this.renderer.addClass(document.body, 'uw-class');
    } else if (url.includes('reedwellbeing')){ 
      this.renderer.addClass(document.body, 'customdatestyle');
    }
  }
}
