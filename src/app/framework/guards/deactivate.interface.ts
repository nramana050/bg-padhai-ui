import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface ICanDeactivate {
    canExit: (route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot, nextState?: RouterStateSnapshot) 
        => Observable<boolean> | Promise<boolean> | boolean;
}