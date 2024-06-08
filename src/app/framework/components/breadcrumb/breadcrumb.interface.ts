import { Params } from "@angular/router";

export interface IBreadCrumb {
    label: string;
    params?: Params;
    url: string;
    pageMainTitle?: string;
}
