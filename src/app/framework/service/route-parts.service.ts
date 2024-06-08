import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Params } from '@angular/router';
import { ApplicationConstant } from '../constants/app-constant';
import { Utility } from '../utils/utility';

interface IRoutePart {
  title: string;
  breadcrumb: string;
  params?: Params;
  queryParams?: Params;
  url: string;
  urlSegments: any[];
  preserveParam?: string;
}

@Injectable()
export class RoutePartsService {

  public routeParts: IRoutePart[];
  generateRouteParts(snapshot: ActivatedRouteSnapshot): IRoutePart[] {
    let routeParts = [] as IRoutePart[];

    if (snapshot) {
      if (snapshot.firstChild) {
        routeParts = routeParts.concat(this.generateRouteParts(snapshot.firstChild));
      }
      if (snapshot.data['title'] && snapshot.url.length) {
        routeParts.push({
          title: snapshot.data['title'],
          breadcrumb: this.getlable(snapshot.data) ,
          url: snapshot.url[0].path,
          urlSegments: snapshot.url,
          params: snapshot.params,
          preserveParam: snapshot.data['preserveParam'],
          queryParams: snapshot.queryParams
        });
      }
    }
    return routeParts;
  }

  getlable(snapshotData) {
    const featureDetail: any = Utility.getPageTitleByClientIdAndFeatureId(snapshotData['identifier'])
    if(snapshotData['identifier']) {
     return this.setMainTitle(snapshotData, featureDetail)
    } else {
      return snapshotData['title']
    }
  }

  setMainTitle(snapshotData, featureDetail) {
    if (featureDetail?.pageTitle && featureDetail.queryParams) {
      return snapshotData['title']
    }
    else if (featureDetail?.pageTitle){
      return featureDetail?.pageTitle
    }
    else {
      return snapshotData['title']
    }
  }

}
