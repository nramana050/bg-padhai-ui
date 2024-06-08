import { Injectable, Input, NgZone, Output , EventEmitter} from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationConstant } from '../../../framework/constants/app-constant';
import { Utility } from '../../../framework/utils/utility';
import { BaseUrl } from '../../../framework/constants/url-constants';
import { AppInsightsService } from '../../../framework/service/app-insights.service';


const authHeaderString = 'X-Authorization';
const contentTypeHeaderString = 'application/json';

const signInHttpHeaders = new HttpHeaders({
  'Content-Type': contentTypeHeaderString
});

@Injectable()
export class SessionsService {
  @Output() passwordAboutToExpiredFlag: EventEmitter<boolean> = new EventEmitter();

    setPasswordAboutToExpireFlag(flag) {
        localStorage.setItem('passwordCheck', JSON.stringify(flag));
        this.passwordAboutToExpiredFlag.emit(flag);

    }
    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
        private readonly zone: NgZone,
        private readonly appInsightsService: AppInsightsService,
        private readonly dialogRef: MatDialog
    ) { } 

    signin(data: any): any {
      data.appId = localStorage.getItem('ApplicationID')
      data.clientId = localStorage.getItem('clientId')
      return this.http.post<any>(BaseUrl.AUTHENTICATE + '/login', data ,  { headers: signInHttpHeaders, observe: 'response' })
        .pipe(
          tap(resp => {
              this.resolveSessionParams(resp);
          })
        );
    }

    signout() {
        this.appInsightsService.clearAuthenticatedUserContext();
        this.dialogRef.closeAll();
        return this.http.get(BaseUrl.AUTHENTICATE + '/logoutUser')
        .pipe(finalize(() => this.onSignoutTap()));
    }

    onSignoutTap() {
        localStorage.clear();
        this.zone.run(() => this.router.navigate(['/sessions/signin']));
    }

    resolveSessionParams(resp) {
        const xAuthToken = resp.headers.get(authHeaderString).split(' ');
        const token = xAuthToken[1];
        localStorage.setItem('token', token);
        if (resp.body.heartbeat) {
            localStorage.setItem('session', btoa(JSON.stringify(resp.body)));
        }
    }

    hasResource(auth: string[]) {

        if (localStorage.getItem('token') && auth) {
          const payload = atob(localStorage.getItem('token').split('.')[1]);
          const permissions = JSON.parse(payload).listResource;

          if (auth[1] && permissions.filter(feature => +feature.fid === +auth[0])[0]) {
            return !!permissions.filter(feature => +feature.fid === +auth[0])[0].opId.find(operation => +operation === +auth[1]);
          } else {
            return !!permissions.find(permission => +permission.fid === +auth[0]);
          }
        }
        return false;
      }

      getRoleId() {
        if (localStorage.getItem('token')) {
          const tokenBody = atob(localStorage.getItem('token').split('.')[1]);
          const payload = JSON.parse(tokenBody);
          return payload.roleId;
        }
        return 0;
      }

      refreshToken() {

        return this.http.get<any>(`${BaseUrl.AUTHENTICATE}/refreshToken`, { observe: 'response' })
          .pipe(
            tap(resp => {
              this.resolveSessionParams(resp);
            }));
      }
      isRehabSupervisor(roleList) {
        let isValid = false;
        const roleId = this.getRoleId();
        if(roleId !== -1) {
          const role = Utility.getObjectFromArrayByKeyAndValue(roleList, 'roleId', roleId);
          if(role !== null && role.identifier === 'RHS') {
            isValid = true;
          }
        }
        return isValid;
      }
      getClientOrganizations() {
        const href = `${BaseUrl.USER}/user/organizations`;
        return this.http.get<any>(href);
      }

      changeEstablishment(estbId) {
        return this.http.post<any>(`${BaseUrl.AUTHENTICATE}/changeEstablishment/${estbId}`, estbId ,  { headers: signInHttpHeaders, observe: 'response' })
        .pipe(
          tap(resp => {
              this.resolveSessionParams(resp);
          }),
        );
      }

      noticeBoardMessage() {
        const data = {"appId" : localStorage.getItem('ApplicationID') , "clientId" : localStorage.getItem('clientId')};
        const href = `${BaseUrl.AUTHENTICATE}/notification/notice`;
        return this.http.post<any>(href, data);
    }

}
