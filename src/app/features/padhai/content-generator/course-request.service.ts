import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseUrl } from "src/app/framework/constants/url-constants";

@Injectable({
    providedIn: 'root'
})
export class CourseRequestService {
    constructor(private readonly http: HttpClient) { }

    findAllPaginated(sort: string, page: number, size: number, body: any): Observable<any> {

        const href = `${BaseUrl.PADHAI}/courseRequest/search`;
        return this.http.post<any>(href, body, {
            params: new HttpParams()
                .set('sort', sort.toString())
                .set('page', page.toString())
                .set('size', size.toString())
        });
    }

    retryCourseStage(payload): Observable<any> {
        const href = `${BaseUrl.PADHAI}/retry`;
        return this.http.post<any>(href, payload)
    }

}


