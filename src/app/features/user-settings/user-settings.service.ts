import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BaseUrl } from '../../framework/constants/url-constants';

@Injectable()
export class UserSettingsService {

   constructor(private readonly http: HttpClient) { }

   changePassword(payload) {
      const href = `${BaseUrl.USER}/user/changePassword`;
      return this.http.put<any>(href, payload);
   }

}
