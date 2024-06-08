import { Component, ElementRef, OnDestroy, Input, EventEmitter, Renderer2 } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { Confirmation } from './confirm-box.interface';
import { ConfirmService } from './confirm-box.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'vc-confirm-box',
  templateUrl: './confirm-box.component.html',
})
export class ConfirmBoxComponent implements OnDestroy {

  header: string;
  icon: string;
  message: string;
  acceptIcon: string = 'fa-check';
  acceptLabel: string = 'OK';
  acceptVisible: boolean = true;
  rejectIcon: string = 'fa-close';
  rejectLabel: string = 'CANCEL';
  rejectVisible: boolean = true;
  width: any;
  height: any;
  closeOnEscape: boolean = true;
  rtl: boolean;
  closable: boolean = true;
  responsive: boolean = true;
  appendTo: any;
  key: string;
  confirmation: Confirmation;
  _visible: boolean;
  documentEscapeListener: any;
  documentResponsiveListener: any;
  mask: any;
  contentContainer: any;
  positionInitialized: boolean;
  subscription: Subscription;
  showClose: boolean = true;
  hasSecondPopup: boolean = false;
  showTimer: boolean = false;
  minutesDisplay = 0;
  secondsDisplay = 0;
  endTime = 2 * 60;
  countdownSubscription: Subscription;

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2,
    private readonly confirmationService: ConfirmService) {

    this.subscription = confirmationService.requireConfirmation.subscribe(confirmation => {
      this.confirmation = confirmation;
      this.message = this.confirmation.message;
      this.icon = this.confirmation.icon;
      this.header = this.confirmation.header;
      this.rejectVisible = this.confirmation.rejectVisible;
      this.acceptVisible = this.confirmation.acceptVisible;
      this.showClose = this.confirmation.hasOwnProperty("showClose") ? this.confirmation.showClose : true;
      this.acceptLabel = this.confirmation.acceptLabel;
      this.rejectLabel = this.confirmation.rejectLabel;
      this.hasSecondPopup = this.confirmation.hasOwnProperty("hasSecondPopup") ? this.confirmation.hasSecondPopup : false;
      if (this.confirmation.accept) {
        this.confirmation.acceptEvent = new EventEmitter();
        this.confirmation.acceptEvent.subscribe(this.confirmation.accept);
      }
      if (this.confirmation.reject) {
        this.confirmation.rejectEvent = new EventEmitter();
        this.confirmation.rejectEvent.subscribe(this.confirmation.reject);
      }
      this.visible = true;
      this.showTimer = this.confirmation.showTimer;
      if (this.confirmation.countdown) {
        this.startCountdown(this.confirmation.countdown);
      }
    });
  }

  get visible(): boolean {
    document.getElementById('myModalLabel').onkeydown = function (e) {
      if ((e.which === 9) && (e.shiftKey === true)) {
        e.preventDefault(); // so that focus doesn't move out.
        document.getElementById('last').focus();
      }
    }
    const lastElement = document.getElementById('last');
    if (lastElement) {
      lastElement .onkeydown = function (e) {
        if (e.which === 9 && !e.shiftKey) {
          e.preventDefault();
          document.getElementById('myModalLabel').focus();
        }
      }
    }

    return this._visible;
  }

  set visible(val: boolean) {
    this._visible = val;
    if (this._visible) {
      (function () {
        document.getElementById('myModalLabel').focus();
      })();
      this.renderer.addClass(document.body, 'modal-open');
      const a = document.getElementById('myModalLabel');
      setTimeout(function () { a.focus(); }, 10);
      if (!this.positionInitialized) {
        this.positionInitialized = true;
      }
    }
  }

  hide(event?: Event) {
    this.visible = false;
    this.rejectLabel = "Cancel";
    if (event) {
      event.preventDefault();
    }
    this.renderer.removeClass(document.body, 'modal-open');
  }

  ngOnDestroy() {
    if (this.documentResponsiveListener) {
      this.documentResponsiveListener();
    }
    if (this.documentEscapeListener) {
      this.documentEscapeListener();
    }
    if (this.appendTo && this.appendTo === 'body') {
      document.body.removeChild(this.el.nativeElement);
    }
    this.subscription.unsubscribe();
  }

  accept() {
    if (this.confirmation.acceptEvent) {
      this.confirmation.acceptEvent.emit();
    }
    this.hide();
    this.confirmation = null;
  }

  acceptOnHavingSecondpopup() {
    if (this.confirmation.acceptEvent) {
      this.confirmation.acceptEvent.emit();
    }
  }

  reject() {
    if (this.confirmation.rejectEvent) {
      this.confirmation.rejectEvent.emit();
    }
    this.hide();
    this.confirmation = null;
  }

  startCountdown(endTime: number = this.endTime) {
    const interval = 1000;
    const duration = endTime;
    this.countdownSubscription = timer(0, interval)
      .pipe(
        take(duration)
      )
      .subscribe(
        value => {
          this.render((duration - +value) * interval);
        },
        err => { },
        () => {
          this.countdownSubscription.unsubscribe();
          this.reject();
        }
      );
  }

  private render(count) {
    this.secondsDisplay = this.getSeconds(count);
    this.minutesDisplay = this.getMinutes(count);
  }

  private getSeconds(ticks: number) {
    const seconds = ((ticks % 60000) / 1000).toFixed(0);
    return this.pad(seconds);
  }

  private getMinutes(ticks: number) {
    const minutes = Math.floor(ticks / 60000);
    return this.pad(minutes);
  }

  private pad(digit: any) {
    return digit <= 9 ? '0' + digit : digit;
  }
}
