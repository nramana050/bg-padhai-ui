import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { AppConfirmComponent } from './app-confirm.component';

interface IConfirmData {
  title?: string;
  message?: string;
  showTextField?: boolean;
  placeholderTextField?: string;
  showSelectField?: boolean;
  placeholderSelectField?: string;
  optionsSelectField?: any;
  isRequired?: Boolean;
  cancelButtonLabel?:any;
  okButtonLabel?:any;
  okButtonName? : any;
  cancelButtonName? : any;
  preSelectedRadioButtonOption?: any;
  showSelectRadioButtons?: boolean;
  optionsSelectRadioButton?: string[];
  showTextAreaField?: boolean;
  placeholderTextAreaField?: string;
  showOkButtonOnly?: Boolean;
  padding?: string;
}

@Injectable()
export class AppConfirmService {

  constructor(private readonly dialog: MatDialog) {
   
   }

  public confirm(data: IConfirmData = {}): Observable<boolean> {
    data.title = data.title || '';
    data.message = data.message || '';
    data.isRequired = data.isRequired !== undefined ? 
    data.isRequired : true ;
    data.placeholderTextField = data.placeholderTextField || 'Add more details:';
    data.placeholderSelectField = data.placeholderSelectField || 'Select an option';
    data.cancelButtonLabel = data.cancelButtonLabel  ?  data.cancelButtonLabel :'Cancel' ;
    data.okButtonLabel = data.okButtonLabel ? data.okButtonLabel : 'OK';
    data.placeholderTextAreaField = data.placeholderTextAreaField || 'Reason '
    data.showOkButtonOnly = data.showOkButtonOnly || false;
    data.padding = data.padding || '24px';
    let dialogRef: MatDialogRef<AppConfirmComponent>;
    if(data.cancelButtonName === null || data.cancelButtonName === undefined){
      data.cancelButtonName = 'Cancel';
    }
    if(data.okButtonName === null || data.okButtonName === undefined){
      data.okButtonName = 'OK';
    }
    dialogRef = this.dialog.open(AppConfirmComponent, {
      width: '480px',
      disableClose: true,
      
      data: {
        title: data.title,
        message: data.message,
        showTextField: data.showTextField,
        showTextAreaField: data.showTextAreaField,
        placeholderTextField: data.placeholderTextField,
        placeholderTextAreaField: data.placeholderTextAreaField,
        showSelectField: data.showSelectField,
        placeholderSelectField: data.placeholderSelectField,
        optionsSelectField: data.optionsSelectField,
        isRequired: data.isRequired,
        cancelButtonLabel : data.cancelButtonLabel,
        okButtonLabel: data.okButtonLabel,
        cancelButtonName: data.cancelButtonName,
        okButtonName: data.okButtonName,
        preSelectedRadioButtonOption: data.preSelectedRadioButtonOption,
        optionsSelectRadioButton: data.optionsSelectRadioButton,
        showSelectRadioButtons: data.showSelectRadioButtons,
        showOkButtonOnly: data.showOkButtonOnly,
        padding : data.padding
      }
    });
    return dialogRef.afterClosed();
  }
}
