import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class AppService {

    private readonly passwordExpiredFlag: EventEmitter<boolean> = new EventEmitter<boolean>();
    getPasswordExpiredFlag() {
        return this.passwordExpiredFlag;
    }

    setPasswordExpiredFlag(flag: boolean) {
        localStorage.setItem('passwordCheck', JSON.stringify(flag));
        this.passwordExpiredFlag.emit(flag);
    }

}