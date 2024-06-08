import { Component, OnInit } from '@angular/core';
import { IAppFeatures } from '../sidebar/AppFeatures'


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {


  primaryMenu: IAppFeatures[] = [];
  constructor(  ) {

  }

  ngOnInit(): void {
    // this.appFeaturesService.getAppFeatures().subscribe((data: IAppFeatures[]) => {
    //   this.primaryMenu = data;
    // });
  }
  
}
