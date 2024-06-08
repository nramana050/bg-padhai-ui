import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { from, interval, Observable } from 'rxjs';
import { filter, map, toArray, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { CanComponentDeactivate } from 'src/app/framework/guards/can-deactivate.guard';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { PadhaiService } from '../padhai.service';
import { TranslatePopupComponent } from '../translate-popup/translate-popup.component';
import { jsonSchema } from './jsonSchema';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
// import { AppInsightsService } from '../../../framework/service/app-insights.service';
import { CommunicationService } from '../../../framework/service/communication.service';
import { BaseUrl } from 'src/app/framework/constants/url-constants';
import { FileUploadService } from '../../shared/components/file-upload/file-upload.service';
import { LearningOutcomesComponent } from '../learning-outcomes/learning-outcomes.component';
// import * as Editor from 'src/app/features/shared/components/ck-editor/ckeditor';
import {colors} from '../../../../assets/padhaiFontColorConfig/FontColorConfig';
import { MyUploadAdapter } from './custom-ckeditor';
// import * as refExport from '../refExport.json';
// import * as courseStatus from '../courseStatus.json';
// import * as getApproveStatus from '../getApproveStatus.json';
// import * as getLesson from '../getLesson.json';
// import * as getLessonStatus from '../getLessonStatus.json';
// import * as getOutline from '../getOutline.json';
// import * as getSelectedLang from '../selectedLanguages.json';
// import * as getH5pList from '../h5pList.json';
// import * as selectedLanguages from '../selectedLanguages.json';


interface lessonNode {
  name: string;
  status: string;
  index:number;
  isDetailsVisible:boolean;
  children?: lessonNode[];
  hasH5pDetails: Boolean;
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  index:number;
  isDetailsVisible:boolean;
  hasH5pDetails: Boolean;
}

export enum exportTypeEnum {
  PDF_TEACHER = "PDF_TEACHER",
  PDF_LEARNER = "PDF_LEARNER",
  SCORM = "SCORM",
  HTML_ZIP = "HTML_ZIP",
  EPUB = "EPUB",
  MOODLE = "MOODLE"
}


@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.scss']
})

export class EditContentComponent implements OnInit, OnDestroy, CanComponentDeactivate  {

  @ViewChild(MatSelect) matSelect: MatSelect;
  @ViewChild(LearningOutcomesComponent) learningOutcomesComponent: LearningOutcomesComponent;
  // public Editor = Editor;
  editorConfig: any = {
    "placeholder" : "Page details",
    "autoParagraph": false,
    "link": {
      "addTargetToExternalLinks": true,
    },
    "fontColor": {
      "colors": colors
    },
    "uploadImage": {
      "types": ['jpeg', 'jpg', 'png'],
      "maxSize": 500 * 1024
    },
    "mediaEmbed": {
      "removeProviders": [ 'instagram', 'twitter', 'googleMaps', 'flickr', 'facebook', 'spotify' ]
    }
  }
  status: any;
  activeTopic: any;
  primaryColor: any;
  courseDetails: any;
  courseName: any;
  stageTitle: any = 'Course Outline';
  lessonStatusInterval;
  stage = '';
  currentStage: string;


  dots = [1, 2, 3, 4, 5, 6]
  courseId: number;
  moduleCount: number;
  lessonCount: number;
  progress: number;
  courseOutlineDetails: FormGroup;

  lessonDetails = {};
  tempLessonsData = {};
  __tempLessonData__ : any = {};
  __originalTempLessonData__ = {};
  editedFieldChangeDetectedFlagLogs = {};
  editedFieldChangeDetectedFlags = { textEditedFlags: [], feedbackEditedFlags: [], questionEditedFlags: [], pageEditedFlag: false, h5pTypeEditedFlag: false };
  expandedNodes: string[] = [];
  editedTopics = [];

  isLessonExpanded = false;
  isLessonCompleted = false;
  showCourseDetails = false;
  showLessonContainer = false;
  showCourseContainer = false;
  showOutcomeContainer = false;
  editCourseMode = false;
  editLessonMode = false;
  showAssetContainer = false;
  enableEditMode: boolean = false;
  firstTimeLoad = true;
  isOutlineFormEdited = false;
  showLearningOutcomes = false;
  editLearningOutcomeMode = false;
  retryLearningOutcomeFlag = false;
  allH5pSelectedFlag: boolean;
  checkGenerateAssetFlag: boolean = false;

  courseStage: any;

  activeLessonData: any;

  isCourseInvalid: boolean;
  schema = jsonSchema;
  ajv = require('ajv');
  avjModule: any;
  validate: any;

  showLoader = true;

  exportTypeList: any;
  export : any;
  activeNode;
  lastLessonStatusData;
  languages;
  languageInterval
 
  questionFormat = {"questionText": "", "answers": [{"text": "","feedback": ""},{"text": "","feedback": ""},{"text": "","feedback": ""},{"text": "","feedback": ""}]};
  languageList :any;
  defaultLanguage:string = "ENGLISH";
  dynamicTitle
  activeLangauge :string="ENGLISH";
  selectedLanguage : any;
  exit;
  exportlabel;
  question;
  youranswer;
  check;
  pdfforstudent;
  pdfforstaff;
  htmlzip;
  scorm;
  epub;
  exporttomoodle;
  initialFormValue : any;
  h5pTypes: any;
  learningOutcomeTitle : any = 'Learning Outcomes';

  selectedH5pType : any;  

  disableLessonButton = false;
  disableAssetButtons = false;
  languageListForRtl:any

  showFailedStatus = false;
  currentLessonStatus : any;

  private _transformer = (node: lessonNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      status: node.status,
      level: level,
      index : node.index,
      isDetailsVisible:node.isDetailsVisible,
      hasH5pDetails: node.hasH5pDetails
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource: any = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  disableRetry: boolean = false;
  isCourseApproved: boolean;
  licenceExceeded: boolean = false;

  activeModuleIndex:any;
  activeLessonIndex:any;
  licenceDetails: any;
  courseImage :any;
  outlineTextExists: boolean = false;
  loaderUrl = '../../../../assets/CAPTR-nobg.gif';

  constructor(
    private readonly http: HttpClient,
    private _fb: FormBuilder,
    private readonly padhaiService: PadhaiService,
    private readonly activeroute: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly dialog: MatDialog,
    private readonly appConfirmService: AppConfirmService,
    private readonly communicationService : CommunicationService,
    private readonly fileUploadService: FileUploadService,
    // private readonly appInsightsService: AppInsightsService
  ) {
      if(localStorage.getItem('identifier') === 'RWH') {
        this.loaderUrl = '../../../../assets/Reed.png';
      }
    this.activeroute.queryParams.subscribe(params => {
      this.dynamicTitle = params['title'];
      if (this.dynamicTitle) {
        this.activeroute.data.subscribe(data => {
          data.title = this.dynamicTitle;
        });
      }
    });
    this.courseId = this.activeroute.snapshot.params.id;
    this.primaryColor = localStorage.getItem('primaryAppColour');
    this.status = this.router.getCurrentNavigation().extras.state || "";
    this.constructForm();
    this.avjModule = new this.ajv();
    this.courseName = localStorage.getItem('courseName') || null;
    this.getExportToMenuTypes();

   setTimeout(() => {
    this.initialFormValue = this.courseOutlineDetails.value;
      this.courseOutlineDetails.valueChanges.subscribe((newFormValue) => {
        if (this.courseDetails) {
          this.isOutlineFormEdited = !(JSON.stringify(newFormValue) === JSON.stringify(this.initialFormValue));
        }
      });
   }, 2000);

    this.communicationService.newImageUploadedSubject.subscribe(file => {
      console.log("image replace event received", file);
      if (file) { 
        this.refreshPreview();
      }
    });

    var subscribedOnce = false;
    this.communicationService.courseOutlineSuccessSubject.pipe(debounceTime(300),distinctUntilChanged()).subscribe(data => {
      if (subscribedOnce == false && this.courseStage == 'Outline') {
        subscribedOnce = true;
        this.getCourseoutlineDetails();
      }
    });
  }

  public onReady(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (data) => {
      return new MyUploadAdapter(data, this.courseId, this.padhaiService, this.snackBarService);
    };
  }

  refreshPreview() {
    console.log("refreshing preview");
    this.getLessonStatus('Asset',false);
  }
  getExportToMenuTypes() {
    this.padhaiService.getExportType().subscribe(data => {
      this.exportTypeList = data;
      if (localStorage.getItem('moodleUrl') === null || localStorage.getItem('moodleUrl') == 'null') {
        this.exportTypeList = this.exportTypeList.filter(item => item.description != 'Export to LMS');
      }
    })
    // const data = refExport;
    // this.exportTypeList = data.export;
  }

  isNodeExpanded(node: any): boolean {
    return this.expandedNodes.includes(node.name);
  }

  async selectStage() {
    await this.getCourseStatusData();
    switch (this.courseStage) {
      case 'Outline':
        this.stageTitle = 'Course Outline';
        this.showCourseContainer = true;
        this.showLessonContainer = false;
        this.showAssetContainer = false;
        break;
      case 'Lesson':
        this.stageTitle = 'Lesson Details';
        this.isLessonCompleted = true;
        await this.getLessonDetails(this.activeLangauge, true);
        this.getLessonStatus('Lesson', true);
        if (!this.lessonStatusInterval || this.lessonStatusInterval.closed) this.lessonStatusInterval = interval(2000).subscribe(sec => this.getLessonStatus('Lesson', false));
        this.showCourseContainer = false;
        this.showLessonContainer = true;
        this.showAssetContainer = false;
        break;
      case 'Outcome':
        this.stageTitle = 'Learning Outcomes';
        this.getLessonStatus('Lesson', true);
        await this.getLessonDetails(this.activeLangauge);
        this.activeTopic = null;
        this.showCourseContainer = false;
        this.showLessonContainer = false;
        this.showAssetContainer = false;
        this.showOutcomeContainer = true;
        this.showLearningOutcomes = true;
        this.setLOTabActive();
        break;         
      case 'Asset':
      case "Publish":
        this.stageTitle = 'Preview Course';
        await this.getLessonDetails(this.activeLangauge);
        this.getLessonStatus('Asset', true);
        this.activeTopic = null;
        this.getSelectedLanguagesData();
        if (!this.lessonStatusInterval || this.lessonStatusInterval.closed) this.lessonStatusInterval = interval(2000).subscribe(sec => this.getLessonStatus('Asset', false));
        this.showCourseContainer = false;
        this.showLessonContainer = false;
        this.showAssetContainer = false;
        this.showOutcomeContainer = true;
        this.showLearningOutcomes = true;
        this.setLOTabActive();
        this.showLoader = false;
        break;
    }
  }

  constructForm() {

    this.courseOutlineDetails = this._fb.group({
      modules: this._fb.array([])
    });
  }

  get modules() {

    return this.courseOutlineDetails.get('modules') as FormArray;
  }

  async ngOnInit() {
    this.getH5pTypeList();
    await this.getCourseStatusData();
    this.getCourseoutlineDetails();
    this.getLanguageData(this.activeLangauge).subscribe(data => {
      this.exit		= data['exit'];
      this.exportlabel		= data['exportlabel'];
      this.question		= data['question'];
      this.youranswer		= data['youranswer'];
      this.check		= data['check'];
      this.pdfforstudent		= data['pdfforstudent'];
      this.pdfforstaff		= data['pdfforstaff'];
      this.htmlzip		= data['htmlzip'];
      this.scorm		= data['scorm'];
      this.epub		= data['epub'];
      this.exporttomoodle		= data['exporttomoodle'];
      this.learningOutcomeTitle  = data['learningOutcomes'];
    });
    this.getH5pTypeList();
    this.unsubscribeIntervals();
  }
  getLanguageData(languageCode: string) {
    return this.http.get(`assets/language/${languageCode.toLowerCase()}.json?buildId=${environment.buildId}`);   
  }
  ngOnDestroy(): void {
    this.unsubscribeIntervals();
  }
  unsubscribeIntervals(){
    if (this.lessonStatusInterval && !this.lessonStatusInterval.closed) this.lessonStatusInterval.unsubscribe();
    if (this.languageInterval && !this.languageInterval.closed) this.languageInterval.unsubscribe();
  }
  addFractionKeyInQuestionOptions() {
    from(this.tempLessonsData['modules']).pipe(map((courses, i) => courses['lessons'].map((lesson, j) => lesson.quiz.questions.map((question, k) => question.answers.map((answer, index) => this.tempLessonsData['modules'][i].lessons[j].quiz.questions[k].answers[index]['fraction'] = index === 0 ? 1 : 0))))).subscribe();
  }

  canDeactivate(): Observable<boolean> | boolean {
    this.unsubscribeIntervals();
    this.communicationService.dataServiceSubject.next();
    if( (this.editedTopics.length > 0 && this.stage == 'lessongenerated') || this.isOutlineFormEdited){
      return this.appConfirmService.confirm({ title: `Progress not saved`, message: 'Are you sure you want to exit without saving.' });
    }else{
      return true
    }
  }
  
  async getCourseoutlineDetails() {
    let statusData = await this.getRetryStatus();
    let courseStatus = (statusData['courseStatus'] + statusData['outlineStatus']).toLowerCase().replace(/\s/g, '');
    this.stage = courseStatus;
    if (statusData['courseStatus'] == 'Outline') this.showCourseContainer = true;
    switch (courseStatus) {
      case 'outlinegenerated':
          this.prepareOutlineDetails();
        break;
      
      case 'outlinefailed':
        this.stage = 'outlinefailed';
        let outlineData : any = await this.getOutlineData();
        if(outlineData.courseOutLine != null){
          this.courseDetails = outlineData;
          this.outlineTextExists = true
        }
        const courseAssetData= this.getCourseImagePath(outlineData.asset)
        this.courseImage = courseAssetData.path
        this.communicationService.dataServiceSubject.next({ img: this.courseImage, stage: this.stage ,course:courseAssetData});
        this.communicationService.courseImageSubject.next({currentStatus : this.stage})
        break;

      case 'outlineinprogress':
        if(window.location.href.includes('/padhai/edit-content')){
          setTimeout(() => {
            this.getCourseoutlineDetails();
            }, 2000);
        }
        break;
    }

    if(statusData['courseStatus'] != 'Outline'){
      this.prepareOutlineDetails();
    }
  }

  getOutlineData(){
    return new Promise(resolve =>{
      // const res = getOutline;
      // resolve(res.outlineData);
      this.padhaiService.getCoursesRequest(this.courseId).subscribe(async res => {        
        resolve(res);
      },err=>{
        this.showCourseContainer = false;
        resolve(err);
      })
    })
  }

  async prepareOutlineDetails(){
    let res : any = await this.getOutlineData();
    this.moduleCount = res.moduleCount;
    this.lessonCount = res.lessonCount;
    await this.getCourseStatusData();

    if(res.asset) {
      const courseAssetData= this.getCourseImagePath(res.asset)
      this.courseImage = courseAssetData.path
      this.communicationService.dataServiceSubject.next({ img: this.courseImage, stage: this.stage ,course:courseAssetData});
    }

    if (this.courseStage == 'Outline') this.fillCourseDetailsForm(res);
    this.courseDetails = res;    
    await this.selectStage();
    [this.schema.properties.modules.minItems, this.schema.properties.modules.maxItems, this.schema.properties.modules.items.properties.lessons.maxItems, this.schema.properties.modules.items.properties.lessons.minItems] = [res.moduleCount, res.moduleCount, res.lessonCount, res.lessonCount];
    this.validate = this.avjModule.compile(this.schema);
    if (this.courseStage == 'Outline') this.showLoader = false;
  }

  getLessonDetails(language?, isFirstTimeLoad?, isLanguageChange = false){
    return new Promise(resolve=>{
      this.padhaiService.getLessonRequest(this.courseId, language ? language : this.defaultLanguage).subscribe(async res=>{
        // const res = getLesson;

        if(res.lessonDetails && res.lessonDetails.modules && res.lessonDetails.modules.length > 0) from(res.lessonDetails.modules).pipe(map((module : any)=> { module?.lessons?.map(lesson =>{ [1,2,3,4].map( iterator =>{ if(lesson.quiz?.questions?.length < 4) lesson.quiz.questions.push(this.questionFormat)})})})).subscribe()
          // this.tempLessonsData = JSON.stringify(res.lessonDetails);
         
          this.tempLessonsData = JSON.parse(JSON.stringify(res));
          if(isFirstTimeLoad && this.tempLessonsData && this.tempLessonsData["modules"] && this.tempLessonsData["modules"][0]["lessons"]) this.__tempLessonData__= this.tempLessonsData["modules"][0]["lessons"][0];
          this.setIndexToModulesAndLessons();
          this.setDefaultStructureForH5p();
          this.lessonDetails = res.lessonDetails;
          if(isLanguageChange){
              this.getLessonStatus(this.courseStage, true,true)
          }
          resolve('')
        setTimeout(() => {
          this.isValidLesson(this.tempLessonsData);
        }, 1000);
      }, err => {
        // this.appInsightsService.logEvent('Error while changing Language', {err: err, courseId: this.courseId});
        console.log("ERROR =>", err);
      })
    })
  }

  setIndexToModulesAndLessons(){
    let treeIndex = 0;
    if(this.tempLessonsData && this.tempLessonsData['modules']){
      from(this.tempLessonsData['modules']).pipe(map(module =>{
        module['treeIndex'] = treeIndex+=1;
        module['lessons'].forEach(lesson => lesson['treeIndex'] = treeIndex+=1);
      })).subscribe();
    }
  }

  setActiveExpandedModule(node) {
    if (this.isNodeExpanded(node)) {
      this.expandedNodes = this.expandedNodes.filter(name => name !== node.name);
    } else {
      this.expandedNodes.push(node.name);
    }
  }

  fillCourseDetailsForm(courseData) {
    if (courseData && courseData.courseOutLine && courseData.courseOutLine.modules && courseData.courseOutLine.modules.length > 0) {

      let modulesArray = courseData.courseOutLine.modules;
      this.modules.clear();
      let modulesArrayLength = modulesArray.length;
      for (let i = 0; i < modulesArrayLength; i += 1) {

        this.modules.push(this._fb.group({
          title: [{ value: modulesArray[i].title || '', disabled: this.isLessonCompleted }, Validators.required],
          summary: [{ value: modulesArray[i].summary || '', disabled: this.isLessonCompleted }, Validators.required],
          lessons: this._fb.array([])
        }))
        let lessonsPerModuleGroupControl = this.modules.at(i).get('lessons') as FormArray;
        if (modulesArray[i].lessons && modulesArray[i].lessons.length > 0) {

          let lessonsArray = modulesArray[i].lessons;
          let lessonsArrayLength = lessonsArray.length;
          for (let j = 0; j < lessonsArrayLength; j += 1) {

            lessonsPerModuleGroupControl.push(this._fb.group({
              title: [{ value: lessonsArray[j].title || '', disabled: this.isLessonCompleted }, Validators.required],
              summary: [{ value: lessonsArray[j].summary || '', disabled: this.isLessonCompleted }, Validators.required],
            }))
          }
        } else {
        }
      }
    } else {
    }
    setTimeout(() => {
      this.showCourseDetails = true;
      this.initialFormValue = this.courseOutlineDetails.value;
      this.isOutlineFormEdited = false;
    }, 50);
  }

  prepareLessonTree(modules, lessonStatusData?, stageType?,firstTimeLoad?) {
    let modulesData = modules;  
    for (let i = 0; i < lessonStatusData.length; i++) {
      let moduleStatusData = lessonStatusData[i];
    
      let moduleIndex = modulesData.findIndex((module, mIndex) => mIndex === i);

      if (moduleIndex !== -1) {
        for (let j = 0; j < moduleStatusData.lessons.length; j++) {
        
          let lessonStatus = moduleStatusData.lessons[j].lessonStatus.find(status => (status.type === stageType || (status.type === 'Asset' && stageType === 'Publish')));

          if (lessonStatus) {
            modulesData[moduleIndex].lessons[j].status = lessonStatus.status;
          }
        }
      }
    }
    from(modulesData).pipe(map(module => {
      return {
        name: module['title'], children: module['lessons'].map((lesson, lessonIndex) => {
          return {
            'name': lesson.title,
            'status': lesson.status == 'GENERATED' ? lesson.status : lesson.status == 'IN_PROGRESS' ? 'IN_PROGRESS' : lesson.status == 'FAILED' ? 'FAILED' : 'IN_PROGRESS'
          }

        })
      }
    }), toArray()).subscribe(titles => {
     
        if(this.activeNode){
          for (const module of titles) {
            for (const lesson of module.children) {
              if (lesson.name == this.activeNode.name) this.currentLessonStatus = lesson.status;
            }
          }
        }
        const previouslyExpandedNodes = this.expandedNodes.slice();
        this.dataSource.data = titles;

        previouslyExpandedNodes.forEach(nodeName => {
          const node = this.treeControl.dataNodes.find(n => n.name === nodeName);
          if (node) {
            this.treeControl.expand(node);
          }
        });
        if (firstTimeLoad && this.courseStage != 'Outcome') {
               this.expandAllNodes()  
               this.showLoader = false;  
               if(this.courseStage == 'Lesson' || this.showLearningOutcomes == false){
                this.showLessonDetailsByIndex(1);
               }
        }else{
          if(this.courseStage == 'Outcome'){
            this.showLoader = false;
            this.expandAllNodes(); 
          }
          this.setLessonIndex();
        }
        
    });
  }
  setLessonIndex() {
    let nodeIndex =1;
    this.treeControl.dataNodes.forEach(node => {
      node.index=nodeIndex;
      nodeIndex++;
    });
  }
  expandAllNodes() {
      let nodeIndex =1;
      this.treeControl.dataNodes.forEach(node => {
        if(node?.level==0 && !this.isNodeExpanded(node))
          this.setActiveExpandedModule(node);
        node.index=nodeIndex;
        nodeIndex++;

      });
    this.treeControl.expandAll();
  }

  async saveDraft(courseData) {
    this.disableLessonButton = true;
    await this.patchFromData(courseData);
    this.padhaiService.saveCourseAsDraft(this.courseDetails).subscribe(res => {
      this.editCourseMode = false;
      this.stageTitle = this.stageTitle.includes('Edit') ? this.stageTitle.replace(/edit/i, "") : this.stageTitle;
      // this.appInsightsService.logEvent('Course outline updated successfully.', {res:res});
      this.snackBarService.success(res.message.applicationMessage);
      this.disableLessonButton = false;
      this.getCourseoutlineDetails();
    }, err => {
      // this.appInsightsService.logEvent('Course outline updation error.', {err:err});
      this.snackBarService.error(err.error.applicationMessage);
      this.disableLessonButton = false;
    })
  }

  async saveGenerate(courseData) {
    console.log(courseData.value,"courseData")
    // this.appInsightsService.logEvent('Courses Lessons generate requested', {courseId: this.courseId, courseData: courseData.value});
    this.disableLessonButton = true;
    await this.patchFromData(courseData);
    this.padhaiService.saveAndGenerateCourse(this.courseDetails).subscribe(res => {
      // this.router.navigateByUrl('/padhai');
      this.isOutlineFormEdited = false;
      this.editCourseMode = false;
      this.showCourseContainer = false;
      localStorage.setItem('courseStage', 'Lesson');
      this.getLessonStatus('Lesson', true);
      this.courseStage = 'Lesson';
      this.selectStage();
      this.stageTitle = 'Lesson Details';
      this.showCourseContainer = false;
      this.showLessonContainer = true;
      this.showLoader = true;
      console.log(res.message.applicationMessage, "saveGenerat...")
      // this.appInsightsService.logEvent('Lessons generation is in progress.', {courseId: this.courseId, res: res, courseData: courseData.value, courseDetails: this.courseDetails});
      this.snackBarService.success(res.message.applicationMessage);
    }, err => {
      // this.appInsightsService.logEvent('Lessons generation is in progress error.', {courseId: this.courseId, err: err, courseData: courseData.value, courseDetails: this.courseDetails});
      this.snackBarService.error(err.error.message);
      this.disableLessonButton = false;
    })

  }

  patchFromData(courseData: any) {
    return new Promise(resolve => {
      from(this.courseDetails.courseOutLine.modules).pipe(map((module, moduleIndex) => {
        module['summary'] = courseData.value.modules[moduleIndex].summary;
        module['title'] = courseData.value.modules[moduleIndex].title;
        module['lessons'].forEach((lesson, lessonIndex) => {
          lesson['summary'] = courseData.value.modules[moduleIndex].lessons[lessonIndex].summary;
          lesson['title'] = courseData.value.modules[moduleIndex].lessons[lessonIndex].title;
        });
        return module;
      })).subscribe(res => {
        resolve(null);
      });
    })
  }

  patchStatusToLessonData() {
    return new Promise(resolve => {
      this.tempLessonsData['modules'].forEach((module) => {
        module.lessons.forEach((lesson) => {
          lesson.lessonStatus = [
            {
              "type": "Lesson",
              "status": "NOT_STARTED"
            },
            {
              "type": "Asset",
              "status": "NOT_STARTED"
            }
          ]
        });
      });
      resolve(this.tempLessonsData);
    })
  }

  async editLesson(node) {
    this.currentLessonStatus = node.status;
    this.showFailedStatus = false;
    this.showLearningOutcomes = false;
    this.setLOTabActive();
    this.activeNode = node;
    this.activeTopic = node.index;
    let isNewImageUploaded = false;
    this.communicationService.newImageUploadedSubject.subscribe(data => isNewImageUploaded = data);  
    if (node.status == 'GENERATED' || this.courseStage == 'Asset') {
      this.showLoader = true;
        if(node.status == 'GENERATED' && !this.activeNode.isDetailsVisible)
        this.activeNode.isDetailsVisible=true;
        if(this.courseStage == 'Lesson'){
          if(this.stage != 'lessongenerated') await this.getLessonDetails(this.activeLangauge);
        }else{
          if(this.stage != 'assetgenerated' || isNewImageUploaded){
            this.communicationService.newImageUploadedSubject.next(false); 
            await this.getLessonDetails(this.activeLangauge);
          }
        }
      from(this.tempLessonsData['modules']).pipe(
        map(courses => courses['lessons'].filter(lesson => lesson.treeIndex == node.index)),
        filter(_i => _i.length !== 0)
      ).subscribe(res => {
        this.activeLessonData = JSON.parse(JSON.stringify(res[0]));
        let courseDataLength = this.tempLessonsData['modules'].length;
        for (let i = 0; i < courseDataLength; i+=1) {
          let lessonDataLength = this.tempLessonsData['modules'][i].lessons.length;
          for (let j = 0; j < lessonDataLength; j+=1) {
            if(this.tempLessonsData['modules'][i].lessons[j].title == this.activeLessonData.title){ 
              this.activeModuleIndex = i+1;
              this.activeLessonIndex = j+1;
            }
          } 
        }
        
    if(this.courseStage == 'Lesson') this.selectedH5pType = this.h5pTypes.find(item => item.identifier == this.activeLessonData['h5pDetails'].h5pType)?.type;

        this.showLoader = false;
        this.prepareLessonDataAndFlags(res);
      })
    }
    else {
      this.showFailedStatus = node.status == 'IN_PROGRESS' ? false : true;
      this.showLoader = true;
    }
    console.log("Setting active node", node);
  }

  showLessonDetailsByIndex(lessonId) {

    let node = this.treeControl.dataNodes[lessonId];
    if (node){
      if(!this.isNodeExpanded(node))
        this.expandedNodes.push(this.treeControl.dataNodes[lessonId].name);
      this.editLesson(node);
      this.treeControl.expand(node)
    }

  }

  prepareLessonDataAndFlags(lessonData) {
    this.__tempLessonData__ = lessonData[0];
    from(this.lessonDetails['modules']).pipe(
      map(courses => courses['lessons'].filter(lesson => lesson.title == lessonData[0].title)),
      filter(_i => _i.length !== 0)
    ).subscribe(res => {
      this.__originalTempLessonData__ = JSON.parse(JSON.stringify(res[0]));
    })
    if (this.editedFieldChangeDetectedFlagLogs[`'${lessonData[0].title}'`]) {
      this.editedFieldChangeDetectedFlags = JSON.parse(JSON.stringify(this.editedFieldChangeDetectedFlagLogs[`'${lessonData[0].title}'`]));
    } else {

      this.editedFieldChangeDetectedFlags.textEditedFlags = this.__tempLessonData__['quiz'].questions.map(() =>
        this.__tempLessonData__['quiz'].questions[0].answers.map(() => false)
      );
      this.editedFieldChangeDetectedFlags.feedbackEditedFlags = this.__tempLessonData__['quiz'].questions.map(() =>
        this.__tempLessonData__['quiz'].questions[0].answers.map(() => false)
      );
      this.editedFieldChangeDetectedFlags.questionEditedFlags = this.__tempLessonData__['quiz'].questions.map(() => false);
      this.editedFieldChangeDetectedFlags.pageEditedFlag = false;
      this.editedFieldChangeDetectedFlags.h5pTypeEditedFlag = false;
    }
  }

  isEdited(key: string, i: number, j: number): boolean {

    switch (key) {
      case 'text':
        return this.editedFieldChangeDetectedFlags.textEditedFlags[i][j];
      case 'feedback':
        return this.editedFieldChangeDetectedFlags.feedbackEditedFlags[i][j];
      case 'page':
        return this.editedFieldChangeDetectedFlags.pageEditedFlag;
      case 'question':
        return this.editedFieldChangeDetectedFlags.questionEditedFlags[i];
      case 'h5pType':
        return this.editedFieldChangeDetectedFlags.h5pTypeEditedFlag;
    }
  }

   async saveLessonForm() {
    this.checkGenerateAssetFlag = false;
    //modify h5p structure if it's empty
    let payload = await this.modifyStructure(true, JSON.parse(JSON.stringify(this.tempLessonsData)));
    this.disableAssetButtons = true;
    this.padhaiService.saveLessonAsDraft(payload).subscribe(async res => {
      // this.setDefaultStructureForH5p();
      this.editLessonMode = false;
      this.stageTitle = this.stageTitle.includes('Edit') ? this.stageTitle.replace(/edit/i, "") : this.stageTitle;
      await this.getLessonDetails(this.activeLangauge);
      // this.appInsightsService.logEvent('Course Lessons updated Successfully.', {courseId: this.courseId, res: res, courseDetails: this.courseDetails});
      this.resetFlags();
      this.snackBarService.success(res.message.applicationMessage);
      this.disableAssetButtons = false;
    }, err => {
      // this.appInsightsService.logEvent('Course Lessons updation error.', {courseId: this.courseId, err: err, courseDetails: this.courseDetails});
      this.snackBarService.error(err.error.applicationMessage);
      this.disableAssetButtons = false;
      this.setDefaultStructureForH5p();
    })
  }

  changeDetect(key?, i?, j?) {

    this.detectEditedFields(i, j, key);

    from(this.lessonDetails['modules']).pipe(
      map(courses => courses['lessons'].filter(lesson => lesson.title == this.__tempLessonData__['title'])),
      filter(_i => _i.length !== 0)
    ).subscribe((res :any) => {

      let isLessonChanged = false;
      if( JSON.stringify(this.__tempLessonData__['page']) !== JSON.stringify(res[0]['page'])
       || JSON.stringify(this.__tempLessonData__['quiz']) !== JSON.stringify(res[0]['quiz'])
       || ( this.__tempLessonData__?.h5pDetails?.h5pType != '' && JSON.stringify(this.__tempLessonData__?.h5pDetails?.h5pType) !== JSON.stringify(res[0]?.h5pDetails?.h5pType))){
        isLessonChanged = true;
      }else{
        isLessonChanged = false;
      }
        
      if (isLessonChanged == true) {

        this.editedTopics.push(this.__tempLessonData__['title'])
        this.dataSource.data.forEach(element => {
          element.children.forEach(lesson => {
            if (lesson.name == this.__tempLessonData__['title']) this.editedTopics.push(element.name)
          })
        });
      } else {

        this.editedTopics = this.editedTopics.filter(item => item !== this.__tempLessonData__['title']);
        this.dataSource.data.forEach(element => {

          let isModuleHasLessonEdited = false;
          element.children.forEach(lesson => {

            if (this.editedTopics.includes(lesson.name)) isModuleHasLessonEdited = true;
          });
          if (!isModuleHasLessonEdited) this.editedTopics = this.editedTopics.filter(item => item !== element.name);
        });
      }
    })
  }

  detectEditedFields(i?, j?, key?) {

    let inputValue;
    let defaultValue;
    switch (key) {
      case 'text':
        inputValue = this.__tempLessonData__['quiz'].questions[i].answers[j][`${key}`];
        defaultValue = this.__originalTempLessonData__['quiz'].questions[i].answers[j][`${key}`];
        
        this.editedFieldChangeDetectedFlags.textEditedFlags[i][j] = inputValue === defaultValue ? false : true;
        break;
      case 'feedback':
        inputValue = this.__tempLessonData__['quiz'].questions[i].answers[j][`${key}`];
        defaultValue = this.__originalTempLessonData__['quiz'].questions[i].answers[j][`${key}`];
        this.editedFieldChangeDetectedFlags.feedbackEditedFlags[i][j] = inputValue === defaultValue ? false : true;
        break;
      case 'page':
        inputValue = this.__tempLessonData__['page'];
        defaultValue = this.__originalTempLessonData__['page'];
        this.editedFieldChangeDetectedFlags.pageEditedFlag = inputValue === defaultValue ? false : true;
        break;
      case 'question':
        inputValue = this.__tempLessonData__['quiz'].questions[i].questionText;
        defaultValue = this.__originalTempLessonData__['quiz'].questions[i].questionText;
        this.editedFieldChangeDetectedFlags.questionEditedFlags[i] = inputValue === defaultValue ? false : true;
        break;
      case 'h5pType':
        inputValue = this.__tempLessonData__['h5pDetails'].h5pType;
        defaultValue = this.__originalTempLessonData__['h5pDetails'];
        this.editedFieldChangeDetectedFlags.h5pTypeEditedFlag = inputValue === defaultValue ? false : true;
        break;

    }
    this.editedFieldChangeDetectedFlagLogs[`'${this.__originalTempLessonData__["title"]}'`] = JSON.parse(JSON.stringify(this.editedFieldChangeDetectedFlags));
    this.isValidLesson(this.tempLessonsData);
  }

  async generateAsset(outcomesData) {
    await this.getLicenceDetails('asset');
    if(this.licenceExceeded){
      this.resetCourseOutcomeComponent();
    } else {
    // this.appInsightsService.logEvent('Courses assets generate requested', {tempLessonsData: this.tempLessonsData});
    this.tempLessonsData['outcomes'] = outcomesData;
     await this.patchStatusToLessonData();
      this.padhaiService.assetGeneration(this.tempLessonsData).subscribe(res => {
        this.editLearningOutcomeMode = false;
        localStorage.setItem('courseStage', 'Asset');
        this.getLessonStatus('Asset',false);
        this.courseStage = 'Asset';
        this.selectStage();
        this.stageTitle = 'Preview course';
        this.activeTopic = "";
        this.showCourseContainer = false;
        // this.appInsightsService.logEvent('Course Assest Generation is in progress.', {res: res}); 
        this.snackBarService.success(res.message.applicationMessage);
      }, err => {
        // set back to outcome
        this.resetCourseOutcomeComponent();
        // this.appInsightsService.logEvent('Course Assest Generation Error.', {error: err});
        if(err.error.errors != null){
          this.snackBarService.error(err.error.message);
        } else {
          this.snackBarService.error(err.error.applicationMessage);
        }
      })
    }
  }

  resetCourseOutcomeComponent() {
    this.learningOutcomesComponent.courseStage = 'Outcome';
    this.learningOutcomesComponent.disableButtons = false;
  }

  resetFlags(){
    this.editedTopics = [];
    this.editedFieldChangeDetectedFlags = { textEditedFlags: [], feedbackEditedFlags: [], questionEditedFlags: [], pageEditedFlag: false, h5pTypeEditedFlag: false };
    this.editLesson(this.treeControl.dataNodes[1]); 
  }
  isValidLesson(data) {

    this.isCourseInvalid = this.validate(data) ? false : true;
  }

  toggleEditCourseMode() {
    this.editCourseMode = !this.editCourseMode;
    if (this.editCourseMode) {
      this.stageTitle = 'Edit ' + this.stageTitle;
    } else {
      this.stageTitle = this.stageTitle.includes('Edit') ? this.stageTitle.replace(/edit/i, "") : this.stageTitle;
    }
    // this.appInsightsService.logEvent('Courses Edit Mode toggle', {stageTitle: this.stageTitle});
  }

  toggleEditLessonMode() {
    this.editLessonMode = !this.editLessonMode;
    if (this.editLessonMode) {
      this.stageTitle = 'Edit ' + this.stageTitle;
      this.editLesson(this.activeNode)
    } else {
      this.stageTitle = this.stageTitle.includes('Edit') ? this.stageTitle.replace(/edit/i, "") : this.stageTitle;
    }
    // this.appInsightsService.logEvent('Lesson Edit Mode toggle', {stageTitle: this.stageTitle});
  }

  toggleEditLearningOutcomeMode(){
    this.editLearningOutcomeMode = !this.editLearningOutcomeMode;
    if (this.editLearningOutcomeMode) {
      this.stageTitle = 'Edit ' + this.stageTitle;
    } else {
      this.stageTitle = this.stageTitle.includes('Edit') ? this.stageTitle.replace(/edit/i, "") : this.stageTitle;
    }
  }

  getLessonStatus(stageType,expand, isLanguageChange = false) {
    if(window.location.href.includes("/edit-content/")){
      this.enableEditMode = false;
      if(isLanguageChange){
        this.enableEditMode = true;
        this.prepareLessonTree(this.tempLessonsData['modules'], this.lastLessonStatusData[0].courseOutLine.modules, stageType,expand)
      }else{
        this.padhaiService.getCourseLessonStatus(this.courseId, stageType).subscribe(statusData => {
          this.lastLessonStatusData = statusData;
          this.checkLessonStatus(statusData[0].courseOutLine.modules, this.courseStage == 'Lesson' ? 'Lesson' : 'Asset', false);
          this.prepareLessonTree(this.courseDetails.courseOutLine.modules, statusData[0].courseOutLine.modules, stageType,expand)
        }, err => {
          console.log("ERROR =>", err);
        })
        // const status = getLessonStatus;
        // const statusData = status.lessonStatusData;
        // this.lastLessonStatusData = statusData;
        // this.checkLessonStatus(statusData[0].courseOutLine.modules, this.courseStage == 'Lesson' ? 'Lesson' : 'Asset', false);
        // this.prepareLessonTree(this.courseDetails.courseOutLine.modules, statusData[0].courseOutLine.modules, stageType,expand)

        this.getRetryStatus();
      }
    }
  }

  async checkLessonStatus(statusData, statusType, h5pStatus) {
    const totalLessonCount = this.moduleCount * this.lessonCount;
    let generatedLessonCount = 0, failedLessonCount=0;
    let isActiveNodeGenerated:boolean = false;
    let isActiveNodeFailed : boolean = false;
    let nodeIndex=0;
    for (const module of statusData) {
      nodeIndex++;
      for (const lesson of module.lessons) {
        nodeIndex++;
        if (!h5pStatus) {
          lesson.lessonStatus.forEach(item => {
            
            if(item.type === statusType && (item.status === 'GENERATED')){
              generatedLessonCount++;
              if(nodeIndex == this.activeNode?.index && !this.activeNode?.isDetailsVisible){
                this.activeNode.isDetailsVisible= true;
                this.activeNode.status = 'GENERATED';
                isActiveNodeGenerated = true;
              }
            }

            if(item.type === statusType && (item.status === 'FAILED')){
              failedLessonCount++;
              if(nodeIndex == this.activeNode?.index && !this.activeNode?.isDetailsVisible){
                this.activeNode.isDetailsVisible= true;
                this.activeNode.status = 'FAILED';
                isActiveNodeFailed = true;
              }
            }
          })
        }
        //check h5p in each lesson
        else {
          if (lesson.h5pDetails?.h5pType != '') {
            if (nodeIndex == this.activeNode?.index) {
              this.activeNode.hasH5pDetails = true;
            } else {
              this.treeControl.dataNodes.forEach(node => {
                if(lesson.treeIndex == node.index && lesson.h5pDetails?.h5pType != '') {
                  node.hasH5pDetails = true;
                }
              });
            }
          } else {            
            this.allH5pSelectedFlag = false;
          }
        }

        // let lessonStatusArray = lesson.lessonStatus.filter(item => item.type === statusType && (item.status === 'GENERATED'));
        // let failedLessonStatusArray = lesson.lessonStatus.filter(item => item.type === statusType && (item.status === 'FAILED'));
        
       
        //   generatedLessonCount += lessonStatusArray.length;
        //   failedLessonCount += failedLessonStatusArray.length;

      }
    }
    if(failedLessonCount == totalLessonCount) this.showFailedStatus = true;
    if (generatedLessonCount+failedLessonCount == totalLessonCount) {
      this.enableEditMode = true;
      await this.getCourseStatusData();
      if (this.lessonStatusInterval){
        this.lessonStatusInterval.unsubscribe();
      } 
      await this.getLessonDetails(this.activeLangauge, true);
      if(this.showLearningOutcomes != true){
      this.editLesson(this.activeNode);
     }
    }
    if(failedLessonCount>0 || generatedLessonCount+failedLessonCount < totalLessonCount)
    this.generateProgress(generatedLessonCount, totalLessonCount);
    if(isActiveNodeGenerated || isActiveNodeFailed){
      await this.getLessonDetails(this.activeLangauge, false);
      this.editLesson(this.activeNode);
    }
    if (h5pStatus) {
      for (const module of statusData) {
        for (const lesson of module['lessons']) {
          if (lesson.h5pDetails?.h5pType === '') {
            this.allH5pSelectedFlag = false;
            break;
          } else {
            this.allH5pSelectedFlag = true;
          }
        }
        if (!this.allH5pSelectedFlag) {
          break;
        }
      }
      if (!this.allH5pSelectedFlag) {
        this.appConfirmService.confirm({ message: `Please select the interactive assets by editing the respective lessons`, showOkButtonOnly: true });
      }
    }
  }

  generateProgress(lessonCount, totalLessonCount) {
    this.progress = lessonCount / totalLessonCount * 100
    let initialStageProgress = 16;
    const stageProgessInterval = 20

    if (this.stage == "outlinegenerated") {
      initialStageProgress = 20;
    } else if (this.stage == 'lessongenerated') {
      initialStageProgress = 40;
    } else if (this.stage == 'outcomegenerated') {
      initialStageProgress = 60
    } else if (this.stage == "assetgenerated") {
      initialStageProgress = 80
    }    
    const barProgress = ((this.progress / 100) * stageProgessInterval) + initialStageProgress;
    this.showBarProgress(barProgress + '%');
  }

  showBarProgress(barProgress) {
    let bar = document.getElementById('activeProgress');
    bar['style'].width = barProgress;
  }
  getCourseStatusData() {

    return new Promise(resolve => {
      this.padhaiService.getCourseStatus(this.courseId).subscribe(res => {
        // const status = courseStatus;
        // const res = status.courseStatus;
      
        this.courseStage = res.courseStatus;
        this.currentStage = this.getCurrentStatus(res).toLowerCase().replace(/\s/g, '');
        this.communicationService.courseImageSubject.next({currentStatus : this.currentStage.replace(/\s/g, '')})
        this.showCourseContainer = this.courseStage == 'Outline' ? true : false;
        resolve('');
        let state = this.getGeneratedStatus(res);
        this.stage = state.toLowerCase();
        if(this.stage == 'assetgenerated' || this.stage == 'publishgenerated'){
         this.getTransaltedLanguageListForCourse(this.courseId);
          this.checkCourseApproveStatus();
        }
        let width = this.stage == 'outlinegenerated' ? '20%' : this.stage == 'lessongenerated' ? '40%' : this.stage == 'outcomegenerated' ? '60%' : this.stage == 'assetgenerated' ? '80%' : this.stage == 'publishgenerated' ? '100%' : '0%';  
        this.showBarProgress(width);
      })
    })
  }

  getGeneratedStatus(res: any) {
    switch (res.courseStatus) {
      case "Outline":
        return `${res.courseStatus}${res.outlineStatus}`;
      case "Lesson":
        if (res.lessonStatus == 'Generated')
          return `${res.courseStatus}${res.lessonStatus}`;
        else
          return `OutlineGenerated`;
      case "Outcome":
        if (res.outcomeStatus == 'Generated')
          return `${res.courseStatus}${res.outcomeStatus}`;
        else
          return `LessonGenerated`;
      case "Asset":
        if (res.assetStatus == 'Generated')
          return `${res.courseStatus}${res.assetStatus}`;
        else
          return `OutcomeGenerated`;
      case "Publish":
        if (res.publishStatus == 'Generated')
          return `${res.courseStatus}${res.publishStatus}`;
        else
          return `AssetGenerated`;
      default:
        return `${res.courseStatus}${res.assetStatus}`;
        break;

    }
  }

  getCurrentStatus(res: any) {
    switch (res.courseStatus) {
      case "Outline":
        return `${res.courseStatus}${res.outlineStatus}`;
      case "Lesson":
        return `${res.courseStatus}${res.lessonStatus}`;
      case "Outcome":
        return `${res.courseStatus}${res.outcomeStatus}`;
      case "Asset":
        return `${res.courseStatus}${res.assetStatus}`;
      case "Publish":
          return `${res.courseStatus}${res.publishStatus}`;
      default:
        return `${res.courseStatus}`;

    }
  }
  selectExportType(exportFile) {
    switch (exportFile) {
      case 'PDF For Staff':
        this.export = exportTypeEnum.PDF_TEACHER;
        break;
      case 'PDF For Student':
        this.export = exportTypeEnum.PDF_LEARNER;
        break;
      case 'SCORM':
        this.export = exportTypeEnum.SCORM;
        break;
      case 'EPUB':
        this.export = exportTypeEnum.EPUB;
        break;
      case 'HTML Zip':
        this.export = exportTypeEnum.HTML_ZIP;
        break;
      case 'Export To LMS':
        this.export = exportTypeEnum.MOODLE;
        break;
    }
    let payload = {
      exportType: this.export,
      courseRequestId: this.courseId,
      langCode :this.activeLangauge,
    }
    // this.appInsightsService.logEvent('Course Export requested', {exportPayload: payload, courseId: this.courseId});
    if (payload.exportType !== exportTypeEnum.MOODLE) {
      this.padhaiService.getLessonRequest(this.courseId, this.activeLangauge).subscribe(async res=>{
        // const res = getLesson;
        if(res.lessonDetails.assetsPath  == null){
          this.snackBarService.success("Preparing for export");
        } else {
          let isAssetPresent = false
          res.lessonDetails.assetsPath.forEach(asset => {
            if (asset.exportType == payload.exportType) {
              isAssetPresent = true
            }
          })
          if (!isAssetPresent) {
            this.snackBarService.success("Preparing for export");
          }
        }
      })
      this.padhaiService.export(payload).subscribe(res => {
        let BlobPath=  this.getBlobPath(res,payload.exportType) ;
        let blobUrl = environment.cdnUrl +'/padhai/'+ BlobPath;
        this.snackBarService.success("Downloading started");
         this.download(blobUrl ,payload.exportType);
        //  this.appInsightsService.logEvent('Course Export download', {blobUrl: blobUrl, courseId: this.courseId});
      }, err => {
        this.snackBarService.error("This action can not be complete at the moment, please try later.");
      });
    } else {
      this.padhaiService.export(payload).subscribe(result => {
        // this.appInsightsService.logEvent('Publish is in progress', {result: result, courseId: this.courseId});
        this.snackBarService.success("Publish is in progress");
      }, err => {
        // this.appInsightsService.logEvent('Publishing error', {err: err, courseId: this.courseId});
        this.snackBarService.error(err.error.applicationMessage);
      })
    }
  }
  getBlobPath(res: any, Type: any): any {
    let asset = res.assetsPath.filter(type => type.exportType == Type);
     return asset.map(asset=>asset.path);
  }

  download(url, downloadName) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = downloadName;
    a.click();
    document.body.removeChild(a);
  }
exportedOption = false;
exportedArray = Array();
changeLanguage(event:any){
  this.activeLangauge = event.languageName;
  this.getLessonDetails(event.languageName, true);
    this.getLanguageData(this.activeLangauge).subscribe(data => {
      this.exit		= data['exit'];
      this.exportlabel		= data['exportlabel'];
      this.question		= data['question'];
      this.youranswer		= data['youranswer'];
      this.check		= data['check'];
      this.exportedArray = [data['pdfforstudent'],data['pdfforstaff'],data['htmlzip'],data['scorm'],data['epub'],data['exporttomoodle']]
      this.exportedOption = true;
      this.learningOutcomeTitle  = data['learningOutcomes'];
    }); 
  // this.appInsightsService.logEvent('Change Language', {languageName: event.languageName, courseId: this.courseId});
  this.languageListForRtl.forEach(lang=>{
    if(lang.languageName == event.languageName){
      if(lang.textDirection){
        document.getElementById('lesson-section').setAttribute("dir","rtl");
        document.getElementById('lesson-menu').setAttribute("dir","rtl");
      } else {
        document.getElementById('lesson-section').removeAttribute("dir");
        document.getElementById('lesson-menu').removeAttribute("dir");
      }
    }
    })
  this.getLessonDetails(event.languageName,false, true); 
}

getTransaltedLanguageListForCourse(courseId: any) {
  // const selectedLanguage = selectedLanguages;
  // const res = selectedLanguage.selectedLanguages
  this.padhaiService.selectedLanguagesData(courseId).subscribe(res => {
    this.languageList = res;
    this.languageListForRtl = res;
    this.checkLanguageStatus(res);
    if(this.selectedLanguage != undefined && this.selectedLanguage !=null){
      let len = res.length;
      for (let i = 0; i < len; i+=1) {
        if( res[i].languageName == this.selectedLanguage.languageName){
          this.matSelect.writeValue(res[i]);
         }
      }
    }else{
      this.selectedLanguage = res[0]
    } 
    this.prepareLanguageDataStructure();
  }, err => {
    console.log("ERROR=> ",err);
  })
}

checkLanguageStatus(languageData){
  let isInProgress = false;
  for (const item of languageData) {
    if (item.isTranslated === "In Progress") {
        isInProgress = true;
        break;
    }
  }
  if(!isInProgress){
    if(this.languageInterval) this.languageInterval.unsubscribe();
  }else{
    if(!this.languageInterval) this.pollingLanguagesData();
  } 
}

prepareLanguageDataStructure(){
  let [retryFunc,addFunc] =  [{
    languageName : 'Retry failed languages',
    type : 'retryButton',
    symbol : 'error_outline'
  },
  {
    languageName : 'Add more languages',
    type : 'addButton',
    symbol : 'add_circle_outline'
  }]

  let translationFailedFlag = false
  const LangTranslationStatusArray = this.languageList.map(lang => lang.isTranslated);
  if (LangTranslationStatusArray.includes('In Progress')) {
    translationFailedFlag = false
  } else if (LangTranslationStatusArray.includes('Failed')) {
    translationFailedFlag = true
  }

    if(translationFailedFlag){
      this.languageList.unshift(retryFunc);
      this.languageList.unshift(addFunc);
    } else {
      this.languageList.unshift(addFunc);
    } 
}

retryLessonAndAsset() {
  // const status = courseStatus;
  // const res = status.courseStatus;
  this.padhaiService.getCourseStatus(this.courseId).subscribe(async res => {
    if(res.courseStatus == "Outline" && res.outlineStatus == "Failed"){
      //perform retry for outline
      let payload = {
        courseRequestId: res.id
      }
      this.padhaiService.retryCourseStage(payload).subscribe(data => {
        this.showFailedStatus = false;
        this.disableRetry = false;
        this.getCourseoutlineDetails();
        // this.snackBarService.success(res.message.applicationMessage);
      }, error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      })    
    }
    else if (res.courseStatus == "Lesson" && res.lessonStatus == "Failed") {
      //perform retry for lesson
      let payload = {
        courseRequestId: res.id,
        languageCode: 'ENGLISH',
      }
      this.selectStage();
      this.padhaiService.retryCourse(payload, res.courseStatus).subscribe(res => {
        this.showFailedStatus = false;
        this.getCourseStatusData();
       
        this.snackBarService.success(res.message.applicationMessage);
      }, err => {
        this.snackBarService.error(err.error.applicationMessage);
      });
    } else if (res.courseStatus == "Asset" && (res.lessonStatus == "Failed" || res.assetStatus == "Failed")) {
      //perform retry for Asset
      // await this.getLicenceDetails('asset');
      if(!this.licenceExceeded){
        let payload = {
          courseRequestId: res.id,
          languageCode: 'ENGLISH',
        }
        this.padhaiService.retryCourse(payload, res.courseStatus).subscribe(res => {
          this.selectStage();
          this.snackBarService.success(res.message.applicationMessage);
        }, err => {
          this.snackBarService.error(err.error.applicationMessage);
        });
      }    
    }
  })
}

getRetryStatus(){
  return new Promise( resolve =>{
    this.padhaiService.getCourseStatus(this.courseId).subscribe(res => {
      // const status = courseStatus;
      // const res = status.courseStatus;
      resolve(res);
      if((res.courseStatus == 'Lesson' && (res.lessonStatus == "Failed" || res.assetStatus == "Failed")) || (res.courseStatus == 'Asset' && (res.lessonStatus == "Failed" || res.assetStatus == "Failed")) || (res.courseStatus == 'Outline' && res.outlineStatus == "Failed")){
        if( this.lessonStatusInterval){
          this.lessonStatusInterval.unsubscribe();
          console.log("Failed for test");
          
        }
        this.disableRetry = true;
      } else {
        this.disableRetry = false;
      }
    })
  })
}

openTranslatePopup(){
  let obj = {
    id : this.courseId,
    topic : this.dynamicTitle
  }
  let translatePopup = this.dialog.open(TranslatePopupComponent,{
    width : '600px',
    data:obj,
    autoFocus:false,
    disableClose: true
   });

   translatePopup.afterClosed().subscribe(res=>{
    if(res) this.pollingLanguagesData();
   })
}

pollingLanguagesData(){
  if (!this.languageInterval || this.languageInterval.closed) this.languageInterval = interval(3000).subscribe(sec => this.getTransaltedLanguageListForCourse(this.courseId));
}


uploadCourseImage(file : File){
  const formData = new FormData();
  formData.append('file', file);
  formData.append('imageDto', JSON.stringify({"courseRequestId":this.courseId,"type":"course"}));
  const href = `${BaseUrl.PADHAI}/uploadImage/image`;
  this.fileUploadService.uploadFile(href, formData , 'POST').then((response :any) => {
   let message = JSON.parse(response);
   this.snackBarService.success(message.message.applicationMessage);
 })
 .catch(error => {
   let errMessage = JSON.parse(error);
   this.snackBarService.error(errMessage.applicationMessage);
 });
 }


selectLanguage(event){
  console.log(event, "Select Language")
  // this.appInsightsService.logEvent('Select Language', {eventParam: event.value, courseId: this.courseId});
  let langData = event.value;
  switch (langData.type) {
    case 'addButton':
      this.openTranslatePopup();
      this.matSelect.writeValue(this.selectedLanguage);
      break;
    case 'retryButton':
      this.retryFailedLanguages();
      this.matSelect.writeValue(this.selectedLanguage);
      break;
    default:
      if(langData.isTranslated == 'Generated') {
        this.showLoader = true;
        this.changeLanguage(langData);
        this.selectedLanguage = event.value;
      }
      break;
  }
}

retryFailedLanguages(){
  let failedTranslations = this.languageList.filter(item => item.isTranslated === "Failed");
  let payload = {
    "languageList":failedTranslations,
    "courseRequestId":this.courseId
    }
  this.padhaiService.retryCourse(payload,'Translate').subscribe(res=>{
    this.pollingLanguagesData();
    // this.appInsightsService.logEvent('Translation in progress', {res: res, courseId: this.courseId});
    this.snackBarService.success(res.message.applicationMessage);
  }, err => {
    // this.appInsightsService.logEvent('Retry failed Languages', {err: err, courseId: this.courseId});
    this.snackBarService.error(err.error.applicationMessage);
  });

}

getSelectedLanguagesData(){
  this.padhaiService.selectedLanguagesData(this.courseId).subscribe(lang=>{
    this.languages = lang;  
  })
  // const lang = getSelectedLang;
  // this.languages = lang.selectedLanguages;

}

  async approveCourse(){
  //call api to approve the coourse approve status
  // await this.getLicenceDetails('approve');
  if(!this.licenceExceeded){
    const approveDialog = this.appConfirmService.confirm({ title: `Publish Course`,message: 'Are you sure you want to publish the course ?' });
    approveDialog.subscribe(result=>{
      if(result){
        this.padhaiService.approveCourse(this.courseId).subscribe(res => {
          this.isCourseApproved = res.responseObject.isCourseApproved;
          if (res.responseObject.isCourseApproved) {
            this.showBarProgress('100%');
            this.stage = 'publishgenerated';
            this.communicationService.dataServiceSubject.next({ img: this.courseImage, stage: this.stage });
            this.snackBarService.success(res.message.applicationMessage);
            // this.appInsightsService.logEvent('Course published successfully', {res: res, courseId: this.courseId});
          }
        },err=>{
          this.snackBarService.error(err.error.applicationMessage);
          // this.appInsightsService.logEvent('Course publish error', {err: err, courseId: this.courseId});
        })
      }
    })
  }
}

  checkCourseApproveStatus() {
    this.padhaiService.getCourseApproveStatus(this.courseId).subscribe(res => {
      this.isCourseApproved = res.isCourseApproved;
    })
    // const res = getApproveStatus;
    // this.isCourseApproved = res.approveStatus.isCourseApproved;

  }

  async generateOutcomes(){
    this.checkLessonStatus(this.tempLessonsData['modules'], 'Lesson', true);
    this.checkGenerateAssetFlag = true;
    if (this.allH5pSelectedFlag && this.allH5pSelectedFlag != undefined) {
      this.checkGenerateAssetFlag = false;
      this.disableAssetButtons = true;
      await this.patchStatusToLessonData();
      let lessonDataPayload = await this.modifyStructure(false, JSON.parse(JSON.stringify(this.tempLessonsData)));
      this.padhaiService.saveLessonAsDraft(lessonDataPayload).subscribe(async res => {
        let payload = {"courseRequestId" : this.courseId};
        this.padhaiService.generateLearningOutcome(payload).subscribe(res=>{
          this.snackBarService.success(res.message.applicationMessage);
          this.getCourseStatusData();
          this.resetFlags();
          this.editLessonMode = false;
          this.showLessonContainer = false;
          localStorage.setItem('courseStage', 'Outcome');
          this.courseStage = 'Outcome';
          this.stageTitle = 'Learning Outcomes';
          this.learningOutcomeTitle = 'Learning Outcomes';
          this.activeTopic = "";
          this.showOutcomeContainer = true;
          this.learningOutcomes();
        },err=>{
          this.snackBarService.error(err.error.message);
          this.disableAssetButtons = false;
        })
      })
    }
  }

  learningOutcomes(){
    this.activeTopic = "";
    this.showLearningOutcomes = true;
    this.setLOTabActive();
  }

  learningOutcomeSaved(){
    this.editLearningOutcomeMode = false;
    this.stageTitle = this.stageTitle.includes('Edit') ? this.stageTitle.replace(/edit/i, "") : this.stageTitle;
  }

  retryLearningOutcome(){
    this.retryLearningOutcomeFlag = true;
    let payload = { "courseRequestId":this.courseId, "languageCode": this.defaultLanguage };
    this.padhaiService.retryCourse(payload,'Outcome').subscribe(res=>{
      this.getCourseStatusData();
      this.snackBarService.success(res.message.applicationMessage);
    },err=>{
      this.snackBarService.error(err.error.applicationMessage);
    })
  }

  updateCourseStatus(status){
    if(status == 'Failed') this.retryLearningOutcomeFlag = false;
    this.getCourseStatusData(); 
  }

  getCourseImagePath(assetList) {
    let assetData = {
      "path":"/assets/images/safety-image.gif",
      "isFailedForSafetySystem":false,
      "isImageGenerationFailed":true
    }
    if(assetList){
       for (let index = 0; index < assetList.length; index++) {
        const asset = assetList[index];
        if(asset.type=="image"){
          let imageAsset=asset
          if (!imageAsset?.isImageGenerationFailed && !imageAsset?.isFailedForSafetySystem) {
            asset.path=environment.cdnUrl + imageAsset.path +'?d='+ imageAsset.timestamp
          } else if (imageAsset?.isImageGenerationFailed && imageAsset?.isFailedForSafetySystem) {
            asset.path='/assets/images/safety-image.gif';
          } else {
            asset.path='/assets/images/safety-image.gif';
          }
          assetData= asset;
          break;
        }
      }
    }
    return assetData;
  }
  

  

  setDefaultStructureForH5p() {
    if (this.tempLessonsData && this.tempLessonsData['modules']) {
      from(this.tempLessonsData['modules']).pipe(map(module => {
        module['lessons'].forEach(lesson => {
          if (lesson['h5pDetails'] == null) {
            lesson['h5pDetails'] =
            {
              'h5pType': ''
            }
          }
        }
        );
      })).subscribe();
    }
  }

  onH5pDetailsChange(nodeData: any) {
    return new Promise(resolve => {
      from(this.tempLessonsData['modules']).pipe(
        map(courses => courses['lessons'].filter(lesson => lesson.treeIndex == nodeData.index)),
        filter(_i => _i.length !== 0)
        ).subscribe(res => {
          res[0]['h5pDetails'].h5pType = this.__tempLessonData__['h5pDetails'].h5pType;
          this.activeNode.hasH5pDetails = true;
          this.treeControl.dataNodes.forEach(node => {
            if(res[0].treeIndex == node.index && res[0]['h5pDetails'].h5pType != '') {
              node.hasH5pDetails = true;
            }
          });
        });
        resolve(this.tempLessonsData);
      });
    }
    
  getH5pTypeList() {
    this.padhaiService.getH5pTypeList().subscribe(data => {
      this.h5pTypes = data;
    });
    // const data = getH5pList;
    // this.h5pTypes = data.h5pList;
  }
  
  async modifyStructure(checkH5pType, payload) {
    return new Promise(resolve=>{
      if (payload && payload['modules']) {
        from(payload['modules']).pipe(map(module => {
          module['lessons'].forEach(lesson => {

            if(lesson.page.includes('<br><br>')){
              lesson.page = lesson.page.replace(/<br><br>/g, '<br></br>');
            }

            if (checkH5pType == true && lesson['h5pDetails'] && lesson['h5pDetails']['h5pType'] === '') {
              lesson['h5pDetails'] = null;
            }
          });
        })).subscribe();
      }
      resolve(payload);
    });
  }
 

  async getLicenceDetails(type: string) {
    await this.padhaiService.getLicenceDetails().toPromise()
      .then(res => {
        this.licenceDetails = res.responseObject;
        if(this.licenceDetails && (this.licenceDetails.totalAssetCourses >= this.licenceDetails.courseGeneratedLimit) && type == 'asset'){
          this.licenceExceeded = true;
          this.appConfirmService.confirm({ title: 'Action required', message: `Sorry, you have reached your limit of courses, this action cannot be completed. Please contact your administrator`, showOkButtonOnly: true });
        } else if(this.licenceDetails && (this.licenceDetails.totalPublishedCourses >= this.licenceDetails.courseApprovedLimit) && type == 'approve'){
          this.licenceExceeded = true;
          this.appConfirmService.confirm({ title: 'Action required', message: `Sorry, you have reached your limit of courses, this action cannot be completed. Please contact your administrator`, showOkButtonOnly: true });
        } else if(this.licenceDetails == null && res.message.applicationMessageCode == 'G2017'){
          this.licenceExceeded = true;
          this.appConfirmService.confirm({ title: 'Action required', message: res.message.applicationMessage, showOkButtonOnly: true });  
        } else {
          this.licenceExceeded = false;
        }
      }).catch((error) => {
        this.licenceExceeded = true;
        this.appConfirmService.confirm({ title: 'Action required', message: `Sorry, you don't have PADHAI licence to perform this action. Please contact your administrator.`, showOkButtonOnly: true });
        console.error('Error fetching licence details:', error);
      });
  }

  setLOTabActive(){
    const loTab = document.getElementById('outcomeTab');
      if(loTab == null){
        setTimeout(() => {
          this.setLOTabActive();
        }, 200);
      }
    if(loTab && loTab.style){
      if(this.showLearningOutcomes == true){
        loTab.style.color = this.primaryColor;
        loTab.classList.add('active');
      }else{
        loTab.style.color = '#000'; 
        loTab.classList.remove('active');
      }
    }
  }

  saveSelectedFlashcardType(type){
    this.__tempLessonData__['h5pDetails']['h5pTypeName'] = type;
  }

}
