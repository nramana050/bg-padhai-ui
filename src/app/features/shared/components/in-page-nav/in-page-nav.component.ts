import { Component, NgZone } from '@angular/core';
import { InPageNavService } from './in-page-nav.service';

@Component({
  selector: 'app-in-page-nav',
  templateUrl: './in-page-nav.component.html',
  styleUrls: ['./in-page-nav.component.scss']
})
export class InPageNavComponent {

  inPageNav = null;

  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly zone: NgZone
  ) {

    this.inPageNavService.currentInPageNav.subscribe(inPageNav => {
      this.inPageNav = inPageNav;

      if (inPageNav) {
        this.zone.runOutsideAngular(() => {
          window.document.addEventListener('scroll', this.onWindowScroll);
        });
      } else {
        window.document.removeEventListener('scroll', this.onWindowScroll, false);
      }
    });

  }

  onWindowScroll(event) {

    const pageNavContainer = 'in-page-nav';
    const topNavContainer = 'top-nav';

    if (event && window.pageYOffset > document.getElementById(topNavContainer).offsetTop) {
      document.getElementById(topNavContainer).classList.add('hide');
      document.getElementById(pageNavContainer).classList.add('sticky');
    } else {
      document.getElementById(topNavContainer).classList.remove('hide');
      document.getElementById(pageNavContainer).classList.remove('sticky');
    }
  }

  onSectionButtonClick() {
    const inPageNavContainer = document.getElementById('in-page-nav');
    if (!inPageNavContainer.classList.contains('responsive')) {
      inPageNavContainer.classList.add('responsive');
    } else {
      inPageNavContainer.classList.remove('responsive');
    }
  }

}
