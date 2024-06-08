import { AppService } from './../../shared/services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserSettingsService } from '../../user-settings/user-settings.service';
import { SnackBarService } from './../../../framework/service/snack-bar.service';
import { SessionsService } from '../../../sessions/sessions.service';
import { ApplicationConstant } from '../../../framework/constants/app-constant';

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null)
  : boolean {
    return control.touched && form.hasError('passwordsDoNotMatch')
  }
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styles: ['.passwordsMatchErr { margin-top: 5px; }']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  errorMatcher = new CrossFieldErrorMatcher();

  passwordValidator(form: FormGroup) {
    const emptyFields = form.get('newPassword').value === "" && form.get('confirmPassword').value === "";
    const condition = form.get('newPassword').value !== form.get('confirmPassword').value;

    return emptyFields || condition ? { passwordsDoNotMatch: true} : null;
  }

  constructor(
    private readonly userSettingsService: UserSettingsService,
    private readonly _fb: FormBuilder,
    private readonly snackBar: SnackBarService,
    private readonly sessionService: SessionsService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.changePasswordForm = this._fb.group({
      existingPassword: ["", Validators.compose([Validators.required])],
      newPassword: ["", Validators.compose(
        [
          Validators.required,
          Validators.pattern(/(?=.*\d)(?=.*[a-zA-Z])(?=.*[!\"#$%&\'\(\)\*+,-\.\/:;<=>\?@\[\\\]^_`{|}~]).{8,36}/)
        ]
      )],
      confirmPassword: ["", Validators.compose([Validators.required])],
    }, { validator: this.passwordValidator });
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      this.changePasswordForm.controls['existingPassword'].setValue(btoa(this.changePasswordForm.controls['existingPassword'].value));
      this.changePasswordForm.controls['newPassword'].setValue(btoa(this.changePasswordForm.controls['newPassword'].value));
      this.changePasswordForm.controls['confirmPassword'].setValue(btoa(this.changePasswordForm.controls['confirmPassword'].value));
      const payload = this.changePasswordForm.value;
      payload.clientId = localStorage.getItem('clientId');
      payload.appId = localStorage.getItem('ApplicationID');
      this.userSettingsService.changePassword(payload).subscribe(data => {
        this.initForm();
        this.snackBar.success(data.applicationMessage);
        this.sessionService.setPasswordAboutToExpireFlag(false);
        localStorage.removeItem('passwordCheck');
      },
      error => {
        this.snackBar.error(error.error.applicationMessage)
      });
    }
  }
}


