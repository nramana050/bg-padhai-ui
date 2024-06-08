import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CanDeactivateComponent } from './can-deactivate.interface';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanDeactivateComponent> {
    
    canDeactivate(component: CanDeactivateComponent): boolean {
        if (!localStorage.getItem('lastActivity')) {
            return true;
        }
        return component.canDeactivate ? component.canDeactivate() : true;
    }
}
