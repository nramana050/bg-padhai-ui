import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CourseRequestService } from './course-request.service';
import { error } from 'console';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { element } from 'protractor';
// import { SessionsService } from 'src/app/sessions/sessions.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePopupComponent } from '../translate-popup/translate-popup.component';
import { ImageUrl } from 'src/app/framework/constants/image--url-constant';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { PadhaiService } from '../padhai.service';
import { AppInsightsService } from '../../../framework/service/app-insights.service';
import { environment } from 'src/environments/environment';
// import * as courseCardData from '../courseCardJson.json';


@Component({
  selector: 'app-content-generator',
  templateUrl: './content-generator.component.html',
  styleUrls: ['./content-generator.component.scss']
})
export class ContentGeneratorComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['topic', 'courseLevel', 'language', 'preferredVoice', 'createdDate', 'createdBy', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  pageSize = 12;
  filterBy = { 'keyword': '' };
  filteredListSize: any;
  sort = 'createdDate,desc';
  stage = '';
  licenceData = null;
  
  constructor(
    private readonly courseRequestService: CourseRequestService,
    private readonly snackBarService: SnackBarService,
    private readonly router: Router,
    // private readonly sessionService: SessionsService, 
    private readonly dialog: MatDialog,
    private readonly appConfirmService: AppConfirmService,
    private readonly padhaiService :PadhaiService,
    private readonly appInsightsService: AppInsightsService
    ) { }



  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    
  ngOnInit(): void {
   this.appInsightsService.logEvent('Courses List Viewed', {});
   this.resolveCourseRequests(this.filterBy);
   this.getLicenceDetailsData();
  }

  ngAfterViewInit() {
   
    this.paginator.page
      .pipe(
        tap(() => {
            this.resolveCourseRequests(this.filterBy);
          document.querySelector('#course_list').scrollIntoView();
        }
        )
      )
      .subscribe();
  }

  onFilter(filterString: string) {
    this.filterBy.keyword = filterString;
    this.paginator.pageIndex = 0;
    this.appInsightsService.logEvent('Courses List filter', {filterBy: this.filterBy.keyword});
    this.resolveCourseRequests(this.filterBy);
  }

  resolveCourseRequests(filterBy) {
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
    this.courseRequestService.findAllPaginated(this.sort,currentPageIndex,this.pageSize, filterBy).subscribe(data => {
      this.appInsightsService.logEvent('Courses List pagination', {sort: this.sort,currentPageIndex: currentPageIndex, pageSize: this.pageSize, filterBy: this.filterBy});
      this.dataSource.data = data.content;
      this.paginator.length = data.totalElements;
      this.getGeneratedStatus(data.content);
    },
      error => {
        this.appInsightsService.logEvent('Courses List pagination error', {error: error});
        this.snackBarService.error(`${error.error.applicationMessage}`);
      })
    //  const data = courseCardData
     
      // this.dataSource.data = data.courseCardData.content;
      // this.paginator.length = 20;
      // this.getGeneratedStatus(data.courseCardData.content);


  }

  onNameSort(filterString: string){
    this.sort = filterString;
    this.appInsightsService.logEvent('Courses List sort', {sort: this.sort});
    this.resolveCourseRequests(this.filterBy);    
  }

  onRefresh(){
    this.resolveCourseRequests(this.filterBy);
  }

  onPaginateChange(event) {
    document.querySelector('#course_list').scrollIntoView();
  }

  goToEdit( element ){
    localStorage.setItem('courseName',element.topic);
    localStorage.setItem('courseStage',element.courseStatus);
    localStorage.setItem('status',element.courseStatus == 'Lesson' ? element.courseStatus + element.lessonStatus : element.courseStatus + element.outlineStatus);
    this.appInsightsService.logEvent('Courses go to edit', {courseName: element.topic, courseStage: element.courseStatus, status: element.courseStatus == 'Lesson' ? element.courseStatus + element.lessonStatus : element.courseStatus + element.outlineStatus});
    this.router.navigate([`padhai/edit-content/${element.id}`],{
      queryParams: { title: element.topic }
    });
  }

  previewCourse( element ){
    localStorage.setItem('courseName',element.topic)
    this.router.navigateByUrl(`padhai/preview-content/${element.id}`);
  }

  goToRetry(element) {
    const retryInDto = { 'courseRequestId': element.id }
    this.courseRequestService.retryCourseStage(retryInDto).subscribe(data => {
    this.resolveCourseRequests(this.filterBy);
    }, error => {
      this.snackBarService.error(`${error.error.applicationMessage}`);
    })
  }
  
  isAuthorized(fid, opId) {
    // return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }
  getImagePath(course) {
    if (course.asset == null) {
      return '../../../../assets/images/baigan.jpg';
    } else {
      if (course.asset) {
        return environment.cdnUrl + course.asset[0].path +'?d='+ course.asset[0].timestamp
      }
    }

  }
  optionClicked(option, course){
    switch (option) {
      case 'translate':
          this.openTranslatePopup(course);
        break;

      default:
        break;
    }
  }

  openTranslatePopup(course){
    let translatePopup = this.dialog.open(TranslatePopupComponent,{
      width : '600px',
      data:course,
      autoFocus:false,
      disableClose: true
     });
  }

  getGeneratedStatus(res: any) {
    for (let index = 0; index < res.length; index++) {
      const element = res[index];
      let status= this.getObject(element);
      status = status.toLowerCase();
      element.status=status;
      console.log('statge  ',status);
      if(status==='outlinegenerated' || status==='lessonin progress' || status==='assetin progress')
      {
        element.progress='25%'
      }
      else if(status==='lessongenerated' || status==='assetfailed')
      {
        element.progress='50%'
      }
      else if(status==='assetgenerated')
      {
        element.progress='75%'
      }
      else if(status==='publishgenerated')
      {
        element.progress='100%'
      }else {
        element.progress='0%'
      }
      element.stage=status;
    }
  }
  
  getObject(element: any) {
    switch (element.courseStatus) {
      case "Outline":
              return `${element.courseStatus}${element.outlineStatus}`;
      break;
      case "Lesson": 
          if(element.lessonStatus=='Generated')     
            return `${element.courseStatus}${element.lessonStatus}`;
          else
          return `OutlineGenerated`;
      break;
           case "Asset":
        if(element.assetStatus=='Generated')
          return `${element.courseStatus}${element.assetStatus}`;
          else
           return  `LessonGenerated`;
      break;
      case "Publish":
           if(element.publishStatus=='Generated')  
           return `${element.courseStatus}${element.publishStatus}`;
           else
           return   `AssetGenerated`;
      break;
      default:
          return `${element.courseStatus}${element.assetStatus}`;
      break;

    }
  }
  onDelete(element) {
    const payload = {
      courseRequestId: element.id, 
    
      courseStage: element.courseStatus 
    }; 
    switch(element.courseStatus){
      case 'Outline':
        payload['status']=  element.outlineStatus
        break;
        case 'Lesson':
          payload['status']=  element.lessonStatus
        break;
        case 'Asset':
          payload['status']=  element.assetStatus
        break;
        case 'Publish':
          payload['status']=  element.publishStatus
          break;
        case 'Outcome':
          payload['status'] = element.outcomeStatus
        break;
    }
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete Course`,
      message: `Are you sure you want to delete this course?`,
      optionsSelectField: this.courseRequestService
    });

    dialogRef.subscribe(result => {
      if (result) {
        
        this.padhaiService

          .deleteCourse(payload).subscribe(          
            response => {
              this.appInsightsService.logEvent('Course Deleted', {response: response,payload: payload});
              this.snackBarService.success(response.applicationMessage);
              this.getLicenceDetailsData();
              this.paginator.firstPage();
              this.resolveCourseRequests(this.filterBy);
            },
            error => this.snackBarService.error(error.error.applicationMessage)
          );
      }
    });

  }

  ngOnDestroy() {
    if(this.licenceData) this.licenceData = null; 
  }

  getLicenceDetailsData(){
    this.padhaiService.getLicenceDetails().subscribe(data=>{
      this.licenceData = data.responseObject;
    })
  }
}
