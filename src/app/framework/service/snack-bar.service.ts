import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable()
export class SnackBarService {

    snackBarConfig: MatSnackBarConfig;
    snackBarRef: MatSnackBarRef<any>;
    horizontalPosition: MatSnackBarHorizontalPosition = 'left';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    snackBarAutoHide = 4000;

    constructor(private readonly snackBar: MatSnackBar) { }

    success(message, config?: MatSnackBarConfig, hideDuration?: any) {
        let snackMessage: string;
        if (message) {
            snackMessage = message;
        }
        else {
            snackMessage = 'Success!';
        }
        if (config !== 'undefined') {
            this.snackBarConfig = config ? config : new MatSnackBarConfig();
            this.snackBarConfig.duration = config ? +hideDuration : +this.snackBarAutoHide;
            this.snackBarConfig.panelClass = 'success-snackbar';
        } else {
            this.snackBarConfig = new MatSnackBarConfig();
            this.snackBarConfig.duration = +this.snackBarAutoHide;
            this.snackBarConfig.panelClass = 'success-snackbar';
        }
        this.snackBarRef = this.snackBar.open(snackMessage, '✖', this.snackBarConfig);
    }

    error(error, config?: MatSnackBarConfig, hideDuration?: any) {
        let snackError: string;
        if (error) {
            snackError = error;
        }
        else {
            snackError = 'Server side error!';
        }
        if (config !== 'undefined') {

            this.snackBarConfig = config ? config : new MatSnackBarConfig();
            this.snackBarConfig.duration = config ? +hideDuration : +this.snackBarAutoHide;
            this.snackBarConfig.panelClass = 'error-snackbar';
        } else {
            this.snackBarConfig = new MatSnackBarConfig();
            this.snackBarConfig.duration = +this.snackBarAutoHide;
            this.snackBarConfig.panelClass = 'error-snackbar';
        }
        this.snackBarRef = this.snackBar.open(snackError, '✖', this.snackBarConfig);
    }
    
    showCustomSnackBar(message,action,config?: MatSnackBarConfig){
        this.snackBar.open(message, action, config);
    }
}