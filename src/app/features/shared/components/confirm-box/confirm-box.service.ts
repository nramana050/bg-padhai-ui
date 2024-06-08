import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Confirmation } from './confirm-box.interface';

@Injectable({
    providedIn: 'root'
})
export class ConfirmService {

    private readonly requireConfirmationSource = new EventEmitter<Confirmation>();
    private readonly acceptConfirmationSource = new EventEmitter<Confirmation>();
    private readonly navigateAwaySelection: Subject<boolean> = new Subject<boolean>();

    requireConfirmation = this.requireConfirmationSource.asObservable();
    accept = this.acceptConfirmationSource.asObservable();

    confirm(confirmation: Confirmation) {
        this.requireConfirmationSource.next(confirmation);
        return this;
    }

    onAccept() {
        this.acceptConfirmationSource.next(void 0);
    }

    choose(choice: boolean): void {
        this.navigateAwaySelection.next(choice);
    }

    get navigateSelection() {
        return this.navigateAwaySelection;
    }

}
