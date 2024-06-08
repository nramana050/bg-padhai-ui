import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {FlatTreeControl} from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { from } from 'rxjs';
import { map, toArray, filter } from 'rxjs/operators';
import { PadhaiService } from '../padhai.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { environment } from 'src/environments/environment';
import { H5P as H5PStandalone } from 'h5p-standalone';
import { AppInsightsService } from '../../../framework/service/app-insights.service';

interface lessonNode {
  name: string;
  children?: lessonNode[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
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
  selector: 'app-preview-course',
  templateUrl: './preview-course.component.html',
  styleUrls: ['./preview-course.component.scss']
})
export class PreviewCourseComponent implements  OnInit, OnDestroy {
 
  status :any;
  activeLessonName : any;
  primaryColor : any;
  courseId: number;
  lessonDetails = <any>{};
  showCourseDetails = false;
  activeModule : any;
  activeLesson :any;
  courseName :any;
  activeLessonOriginalFormat : any;
  questionAnswer = [{answer : null},{answer : null},{answer : null},{answer : null}];
  isAnswerCorrect = [null,null,null,null];
  h5pLibrariesPath = `${environment.cdnUrl}/padhai/h5p_libraries`;
  frameBundlePath = `${environment.cdnUrl}/padhai/h5p_libraries/main/frame.bundle.min.js`;
  assetH5p;
  showH5p = false;
  isExportDisable = false;
  exportTypeList: any;
  export;
  isDarkModeOn;
  languageList :any;
  defaultLanguage:string = "ENGLISH";
  defaultLangOption:string="ENGLISH";


  private _transformer = (node: lessonNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  constructor(
     private _fb: FormBuilder,
     private readonly padhaiService :PadhaiService,
     private readonly activeroute: ActivatedRoute,
     private readonly router : Router,
     private readonly snackBarService: SnackBarService,
     private readonly appConfirmService: AppConfirmService,
     private readonly appInsightsService: AppInsightsService
     ) {
      
    this.courseId = this.activeroute.snapshot.params.id;
    // this.status = this.router.getCurrentNavigation().extras.state || "";
    this.primaryColor = localStorage.getItem('primaryAppColour');
    this.courseName = localStorage.getItem('courseName') || null;

    this.padhaiService.getExportType().subscribe(data => {
      this.exportTypeList = data;
    })

  }

  ngOnInit() {
    this.getTransaltedLanguageListForCourse(this.courseId);
    this.getLessonDetails(this.defaultLanguage); 
  }

  ngOnDestroy(): void {
    // localStorage.removeItem('status')
  }

  getLessonDetails(language:string){
    this.padhaiService.getLessonRequest(this.courseId,language).subscribe( res=>{
   
      this.lessonDetails = res;
      this.courseName = res.courseTopic != null ? res.courseTopic : localStorage.getItem('courseName');
      this.isExportDisable = !(this.lessonDetails?.modules?.length * 4 === this.lessonDetails?.modules?.reduce((total,module)=> total + module.lessons.length, 0));
      this.lessonDetails = JSON.parse(JSON.stringify(res));
      this.prepareLessonTree();
      this.treeControl.expand(this.treeControl.dataNodes[0]);
      this.selectLesson(this.lessonDetails['modules'][0]['lessons'][0]['title']); 
    },err=>{
      console.log("ERROR =>",err);
      this.showCourseDetails = false;
    })
  }

  selectLesson(activeLesson){  
     this.questionAnswer = [{answer : null},{answer : null},{answer : null},{answer : null}];
    this.isAnswerCorrect = [null,null,null,null];
    this.showCourseDetails = false;
    this.showH5p = false;
    this.assetH5p = "";
    from(this.lessonDetails['modules']).pipe(
      map(module => {
        const lesson = module['lessons'].find(lesson => lesson.title === activeLesson);
        if(lesson) return { module, lesson };
      }), filter(value => value !== undefined),
    ).subscribe(res=>{
      this.activeLessonName = activeLesson;
      this.activeModule = res.module;
      this.activeLesson = JSON.parse(JSON.stringify(res.lesson));
      this.activeLesson.asset.map( asset => asset.path = asset.type === 'H5p' ? environment.cdnUrl + asset.path.substring(0, asset.path.lastIndexOf("/")) : environment.cdnUrl + asset.path);
      this.assetH5p = this.activeLesson?.asset?.filter(asset => asset?.type === 'H5p' || asset?.type === 'h5p' )[0] || null;
      this.activeLessonOriginalFormat = res.lesson;
      this.shuffleQuizOptions()
      this.showCourseDetails = true;
      this.renderH5pContent();
      setTimeout(() => {
        this.showH5p = true;
      }, 500);
    })
  }

  renderH5pContent(){
    setTimeout(() => {
      const el = document.getElementById('h5p-container');
      el.innerHTML = '';
      const options = {
        h5pJsonPath:  `${this.assetH5p.path}`,
        librariesPath : `${this.h5pLibrariesPath}`,
        frameJs: `assets/player/frame.bundle.js`,
        frameCss: 'assets/player/styles/h5p.css',
        contentUserData: [{
          state: '{"answers":"essential"}'
        }],
        xAPIObjectIRI:true
      };
  
      new H5PStandalone(el, options).then((e : any)=>{
        let H5P = window["H5P"];
        H5P.externalDispatcher.on("xAPI", (event : any) => {
          console.log("xAPI event: ", event)
        });
       })
    }, 400);
  }

  shuffleQuizOptions(){

    this.activeLesson.quiz.questions.forEach(question => {
      for (let i = question.answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [question.answers[i], question.answers[j]] = [question.answers[j], question.answers[i]];
      }
    });
  }

  prepareLessonTree(){

    from(this.lessonDetails['modules']).pipe(map(course =>{ return { name : course['title'], children : course['lessons'].map( lesson => {return {'name' : lesson.title }})}}),toArray())
      .subscribe( titles =>{
        this.dataSource.data = titles;
    });
  }

  checkAnswer(questionIndex){
    if(this.activeLessonOriginalFormat.quiz.questions[questionIndex].answers[0].text === this.questionAnswer[questionIndex].answer){
        this.isAnswerCorrect[questionIndex] = true;
    }else{
      this.isAnswerCorrect[questionIndex] = false;
    }
    this.appInsightsService.logEvent('Question answer submit', {courseId: this.courseId,questionIndex: questionIndex, isAnswerCorrect: this.isAnswerCorrect});
  }

  resetQuiz(){
    this.questionAnswer = [{answer : null},{answer : null},{answer : null},{answer : null}];
    this.isAnswerCorrect = [null,null,null,null];
    this.shuffleQuizOptions();
  }

  changeLanguage(event:any){
    this.getLessonDetails(event.value);
  }

  getTransaltedLanguageListForCourse(courseId: any) {
    this.padhaiService.getTranslatedLanguageList(courseId).subscribe(res => {
      this.languageList = res;

    }, err => {
      console.log(err);
    })

  }
}