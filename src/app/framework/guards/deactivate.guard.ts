import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ICanDeactivate } from './deactivate.interface';

@Injectable({
  providedIn: 'root'
})
export class DeactivateGuard implements CanDeactivate<ICanDeactivate> {

  constructor() { }

  canDeactivate(component: ICanDeactivate,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return component.canExit(route, state, nextState);
  }
}
