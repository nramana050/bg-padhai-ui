import { Injectable } from '@angular/core';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionsService } from '../../../../app/sessions/sessions.service';


@Injectable({
  providedIn: 'root'
})

export class FileUploadService {

  constructor(
    private readonly spinnerService: SpinnerVisibilityService,
    private readonly sessionsService: SessionsService,
    private readonly snack: MatSnackBar) { }

  public uploadFile(url: string, formData: FormData, requestType: string) {
    return new Promise((resolve, reject) => {
      this.spinnerService.show();
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          this.spinnerService.hide();
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else if (xhr.status === 401) {
            this.sessionsService.signout().subscribe();
            this.snack.open(xhr.response.error.errorMessage || xhr.response.message || 'UnAuthorized User', 'Dismiss', { duration: 6000 });
          } else if (xhr.status === 500) {
            this.snack.open(xhr.response.error.errorMessage || xhr.response.message, 'Dismiss', { duration: 6000 });
          } else if (xhr.status === 409) {
            reject(JSON.parse(xhr.response));
          } else {
            reject(JSON.parse(xhr.response));
          }
        }
      }
      xhr.open(requestType, url, true);
      xhr.setRequestHeader("X-Authorization", 'Bearer ' + localStorage.getItem('token'));
      xhr.send(formData);
     });
  }

  public uploadFileSynced(url: string, formData: FormData) {
    return new Promise((resolve, reject) => {
      this.spinnerService.show();
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          this.spinnerService.hide();
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else if (xhr.status === 401) {
            this.sessionsService.signout().subscribe();
            this.snack.open(xhr.response.error.errorMessage || xhr.response.message || 'UnAuthorized User', 'Dismiss', { duration: 6000 });
          } else if (xhr.status === 500) {
            this.snack.open(xhr.response.error.errorMessage || xhr.response.message, 'Dismiss', { duration: 6000 });
          } else {
            reject(xhr);
          }
        }
      }
      xhr.open("POST", url, true);
      xhr.setRequestHeader("X-Authorization", 'Bearer ' + localStorage.getItem('token'));
      xhr.send(formData);
    });
  }
}
