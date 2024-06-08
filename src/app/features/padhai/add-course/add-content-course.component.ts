import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PadhaiService } from '../padhai.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { AppInsightsService } from '../../../framework/service/app-insights.service';
// import * as keyStage from '../keyStage.json';
// import * as voice from '../voice.json'
@Component({
  selector: 'app-add-content-course',
  templateUrl: './add-content-course.component.html',
  styleUrls: ['./add-content-course.component.scss']
})
export class AddContentCourseComponent implements OnInit {

  courseForm: FormGroup;
  keyStageList;
  languageList;
  moduleList = [1,2,3,4,5,6,7,8,9,10];
  lessonList = [1,2,3,4];
  voiceList;
  countryList;

  constructor(
    private readonly fb: FormBuilder,
    private readonly padhaiService: PadhaiService,
    private readonly router: Router,
    private readonly snackBar: SnackBarService,
    private readonly appInsightsService: AppInsightsService
  ) {
       this.getRefData()
  }

  ngOnInit(): void {
    this.createUserForm();
    this.getLanguageList();
    this.getvoiceList();
  }

  onSubmit(courseForm) {
    console.log(courseForm,"generate")
    const payload = courseForm.getRawValue();
    this.appInsightsService.logEvent('Course Outline requested', {payload: payload});
    this.padhaiService.createCourse(payload).subscribe(resp => {
      this.appInsightsService.logEvent('Course outline generation is in progress', {applicationMessage: resp.message.applicationMessage, responseObjectId: resp.responseObject.id});
      this.snackBar.success(resp.message.applicationMessage);
      localStorage.setItem('courseStage','Outline');
      this. router.navigate([`/padhai/edit-content/${resp.responseObject.id}`],{
        queryParams: { title: resp.responseObject.topic }
      });
      this.appInsightsService.logEvent('Course outline generated', {applicationMessage: resp.message.applicationMessage, responseObjectId: resp.responseObject.id});
    }, error => {
      this.appInsightsService.logEvent('Course outline generation error', {error: error});
      this.snackBar.error(error.error.applicationMessage);
    },)
  }

  getLanguageList() {
    this.padhaiService.getLaunguage().subscribe(data => {
      this.languageList = "ENGLISH";
    })
  }
   getvoiceList() {
    const languageId = 1;
     this.padhaiService.getVoice(languageId).subscribe(data => {
      this.voiceList = data;
    })
    // const data = voice;
    // this.voiceList = data.voices;
  }

  createUserForm() {
    this.courseForm = this.fb.group({
      id: '',
      courseTitle: ['', Validators.required],
      countryId: ['', Validators.required],
      keyStateId: ['', Validators.required],
      languageId: 1,
      voiceId: ['', Validators.required],
      moduleCount: ['',[Validators.required,Validators.min(1)]],
      lessonCount: ['',[Validators.required, Validators.min(1)]]
    })
    
  }

  getRefData(){
    this.padhaiService.getReferenceDataByDomain('Country').subscribe(data => {
      this.countryList = data;    
      if(this.countryList.length == 1){        
        this.courseForm.get('countryId').setValue(this.countryList[0].id);
        this.courseForm.get('countryId').disable();
      }
      
    })
    this.padhaiService.getReferenceDataByDomain('Key_State').subscribe(data => {
      this.keyStageList = data;
    })
    // const level = keyStage;
    // this.keyStageList = level.keyStates;
  }

}
