import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InPageNavService {

  private readonly inPageNavSource = new BehaviorSubject(null);
  currentInPageNav = this.inPageNavSource.asObservable();

  public setNavItems(data: any) {
    this.inPageNavSource.next(data);
  }

  public setProfileUrl(){
    return localStorage.getItem('profileUrl');
    
  }
}
