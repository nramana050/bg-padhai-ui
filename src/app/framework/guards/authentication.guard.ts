import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router,
         RouterStateSnapshot, CanActivateChild } from '@angular/router';

@Injectable()
export class AuthenticationGuard implements CanActivate, CanActivateChild {

    constructor(
        private readonly router: Router,
    ) { }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (localStorage.getItem('token')) {
            return true;
        }
        this.router.navigate(['sessions']);
        return false;
    }

    canActivateChild(childroute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        return this.canActivate(childroute, state);
    }
}
