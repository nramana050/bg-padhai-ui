import { Injectable, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { IBreadCrumb } from '../components/breadcrumb/breadcrumb.interface';

@Injectable({
  providedIn: 'root'
})

export class MainService {

  private title: string;
  private mainTitle: string;

  addToPlanBarEvent: EventEmitter<boolean> = new EventEmitter(true);

  get pageTitle(): string {
    return this.title;
  }

  set pageTitle(value: string) {
    this.title = value;
  }


  get pageMainTitle(): string {
    return this.mainTitle;
  }

  set pageMainTitle(value: string) {
    this.mainTitle = value;
  }

  public showPlanBar() {
    this.addToPlanBarEvent.emit(true);
  }

  public hidePlanBar() {
    this.addToPlanBarEvent.emit(false);
  }

  constructor(
    private readonly pageTitleService: Title,
  ) {

  }

  resolveBreadCrumb(route: ActivatedRoute, url = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {

    let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.title : '';
    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

    const lastRoutePart = path.split('/').pop();
    const isDynamicRoute = lastRoutePart.startsWith(':');
    if (isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart.split(':')[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
      label = route.snapshot.params[paramName];
    }

    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: IBreadCrumb = {
      label,
      url: nextUrl,
    };

    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];

    if (route.firstChild) {
      return this.resolveBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }

    if (this.pageTitle) {
      newBreadcrumbs[newBreadcrumbs.length - 1].label = this.pageTitle;
      newBreadcrumbs[newBreadcrumbs.length - 1].pageMainTitle = this.pageMainTitle;
    }
    this.pageTitleService.setTitle(this.pageTitle || `${newBreadcrumbs[newBreadcrumbs.length - 1].label}`);

    return newBreadcrumbs;
  }

}
