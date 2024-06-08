import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RoutePartsService } from '../../service/route-parts.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommunicationService } from '../../service/communication.service';
import { SnackBarService } from '../../service/snack-bar.service';
import { BaseUrl } from '../../constants/url-constants';
import { FileUploadService } from 'src/app/features/shared/components/file-upload/file-upload.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnDestroy {
  routeParts: any[];
  routerEventSub: Subscription;

  courseStatus : any;

  imagePath : any;
  currentStatus:any;
  isFailedForSafetySystem: boolean = false;
  isImageGenerationFailed: boolean = false;
  constructor(
    private readonly router: Router,
    private readonly routePartsService: RoutePartsService,
    private readonly activeRoute: ActivatedRoute,
    private readonly communicationService : CommunicationService,
    private readonly snackBarService: SnackBarService,
    private readonly fileUploadService: FileUploadService
  ) {

    this.routerEventSub = this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe((routeChange) => {
      this.routeParts = [...this.routePartsService.generateRouteParts(this.activeRoute.snapshot)].reverse();

      this.routeParts.forEach((item, i) => {

        item.breadcrumb = this.parseText(item);
        if (item.preserveParam) {
          item.params = {};
          item.preserveParam.forEach(param => {
            item.params[param] = item.queryParams[param];
          });
        }
        item.urlSegments.forEach((urlSegment, j) => {
          if (j === 0) {
            item.url = `${urlSegment.path}`;
            return item.url;
          }
          item.url += `/${urlSegment.path}`;
        });

        if (i === 0) {
          return item;
        }

        item.url = `${this.routeParts[i - 1].url}/${item.url}`;
        return item;
      });
    });

    this.communicationService.dataServiceSubject.subscribe(imgData =>{
      if(imgData){
        document.getElementById('page-nav').style.marginBottom = '0';
        this.imagePath = imgData.img;
        this.courseStatus = imgData.stage;
        this.isFailedForSafetySystem = imgData?.course?.isFailedForSafetySystem;
        this.isImageGenerationFailed = imgData?.course?.isImageGenerationFailed
      }else{
        this.imagePath = null;
        this.courseStatus = null;
        document.getElementById('page-nav').style.marginBottom = '42px';
      }

      if(imgData == undefined){
        this.imagePath = null;
        this.courseStatus = null;
        this.isFailedForSafetySystem = false;
        this.isImageGenerationFailed = false;
        document.getElementById('page-nav').style.marginBottom = '42px';
      }
    });

    this.communicationService.courseImageSubject.subscribe(courseData =>{
      if(courseData){
        this.currentStatus = courseData.currentStatus
      }
    })
  }

  ngOnDestroy() {
    if (this.routerEventSub) {
      this.routerEventSub.unsubscribe();
    }
  }

  parseText(part) {
    part.breadcrumb = part.breadcrumb.replace(/{{([^{}]*)}}/g, function (a, b) {
      const r = part.queryParams[b];
      return typeof r === 'string' ? r : a;
    });
    return part.breadcrumb;
  }

  openFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if(this.validFileType(file)){
        if (!this.validFileSize(file)) {
          this.uploadCourseImage(file);
        }else{
          this.snackBarService.error("The file size exceeds the set limit of 500 KB. Please choose a smaller file for upload.");
        }
      }else{
        this.snackBarService.error("Invalid file extension.");
      }
    }
  }
  validFileSize(file) {
      const maxFileSize= 500000;
      if(file.size > maxFileSize){
         return true;
       }
       return false;
  }

  validFileType(file) {
    const fileTypes = ['image/jpeg', 'image/png', 'image/.jpg'];
      for (let i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
          return true;
        }
      }
      return false;
    }

  uploadCourseImage(file : File){
    let url = window.location.href;
    const startIndex = url.indexOf('edit-content/') + 'edit-content/'.length;
    const endIndex = url.indexOf('?') !== -1 ? url.indexOf('?') : url.length;
    let courseId = url.substring(startIndex, endIndex);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageDto', JSON.stringify({"courseRequestId":courseId,"type":"course"}));
    const href = `${BaseUrl.PADHAI}/uploadImage/image`;
    this.fileUploadService.uploadFile(href, formData , 'POST').then((response :any) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {        
        this.imagePath = e.target.result;
      };
      reader.readAsDataURL(file); 
     let message = JSON.parse(response);
     this.snackBarService.success(message.message.applicationMessage);
     if(this.currentStatus == 'outlinefailed'){
      this.communicationService.courseOutlineSuccessSubject.next();
     }
   })
   .catch(error => {
     let errMessage = typeof error == typeof "" ? JSON.parse(error) : error;
     this.snackBarService.error(errMessage.applicationMessage);
   });
   }
}
