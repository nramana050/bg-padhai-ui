import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionsService } from '../../sessions/sessions.service';


@Injectable()
export class OAuthGuard implements CanActivate, CanActivateChild {

    constructor(
        protected router: Router,
        protected sessionsService: SessionsService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

        if (localStorage.getItem('isoAuthRequired') === "false" || localStorage.getItem('isoAuthRequired') == 'null') {
            return true;
        }
        this.router.navigate(['person-supported']);
        return false;
    }

    canActivateChild(childroute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.canActivate(childroute, state);
    }

}


