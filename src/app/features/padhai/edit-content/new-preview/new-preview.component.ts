import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { H5P as H5PStandalone } from 'h5p-standalone';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { BaseUrl } from 'src/app/framework/constants/url-constants';
import { FileUploadService } from 'src/app/features/shared/components/file-upload/file-upload.service';
import { CommunicationService } from 'src/app/framework/service/communication.service';
import { AppInsightsService } from '../../../../framework/service/app-insights.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ConvertOmbedToIframe } from './convertOmbedTagsTOIframe';

@Component({
  selector: 'app-new-preview',
  templateUrl: './new-preview.component.html',
  styleUrls: ['./new-preview.component.scss']
})
export class NewPreviewComponent implements OnInit, OnChanges {

  @Input() lessonDetails:any;
  @Input() stage:any;
  @Input() courseStatus:any;
  @Input() courseId : any;
  @Input() moduleIndex : any;
  @Input() lessonIndex : any;
  @Input() activeNodeStatus:any;
  @Input() activeLang: any;
  @Input() currentCourseStatus : any;
  @Input() lessonStatus : any;

  lessonData : any;

  assetH5p = '';
  h5pLibrariesPath = `${environment.cdnUrl}/padhai/h5p_libraries`;
  frameBundlePath = `${environment.cdnUrl}/padhai/h5p_libraries/main/frame.bundle.min.js`;

  imageAsset : any;
  isFailedForSafety:boolean = false;
  isFailedForGeneration:boolean = false;
  audioAsset : any;

  activeLessonOriginalFormat : any;
  questionAnswer = [{answer : null},{answer : null},{answer : null},{answer : null}];
  isAnswerCorrect = [null,null,null,null];
  answer = [null,null,null,null];
  flashcard;
  doesnotsupportaudioelement;
  resetquiz;
  submit;
  correct;
  incorrecttryagain;
  canyouanswer;
  quiz;
  expectedAssetTypeList: string[] = ['image', 'audio', 'H5p'];
  actualAssetList = [];
  missingAssetList = [];
  feedbackText = [null,null,null,null];
  sanitizedHtml: any;

  constructor( private readonly http: HttpClient,
    private readonly snackBarService: SnackBarService,
    private readonly fileUploadService: FileUploadService,
    private readonly communicationService : CommunicationService,
    private readonly appInsightsService: AppInsightsService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    if(this.courseStatus != 'assetgenerated' && this.courseStatus != 'lessongenerated'){
      this.prepareLessonData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.currentCourseStatus = this.currentCourseStatus.replace(/\s/g, '');
    if(this.courseStatus == 'assetgenerated' || this.courseStatus == 'lessongenerated'){
      this.prepareLessonData();
    }
      this.getLanguageData(this.activeLang).subscribe(data => {
        this.flashcard = data['flashcard'];
        this.doesnotsupportaudioelement		= data['doesnotsupportaudioelement'];
        this.resetquiz		= data['resetquiz'];
        this.submit		= data['submit'];
        this.correct		= data['correct'];
        this.incorrecttryagain		= data['incorrecttryagain'];
        this.canyouanswer		= data['canyouanswer'];
        this.quiz = data['quiz'];
      });
  }
  
  getLanguageData(languageCode: string) {
    return this.http.get(`assets/language/${languageCode.toLowerCase()}.json?buildId=${environment.buildId}`);   
  }

  async prepareLessonData(){
    this.lessonData = JSON.parse(JSON.stringify(this.lessonDetails));
    this.convertOmbedIntoIframe();
    await this.setCorrectAnswerFlag();
    this.resetQuiz();
    this.prepareAssetsData();
  }

  async convertOmbedIntoIframe() {

    let convertedHTML = await ConvertOmbedToIframe.convertToIframe(this.lessonData.page);
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(convertedHTML);
  }

  async prepareAssetsData(){

    if(this.currentCourseStatus == 'assetgenerated' && this.lessonData.asset.length == 0){
      return;
    }
  
    this.audioAsset = null;
    this.imageAsset = null;
    this.assetH5p = "";
    if(this.lessonData.asset && this.lessonData.asset != null){
      let len = this.lessonData.asset.length;
      for (let i = 0; i < len; i+=1) {
        this.actualAssetList.push(this.lessonData.asset[i].type);
        switch(this.lessonData.asset[i].type){
          case 'image':
            if(!this.lessonData.asset[i]?.isImageGenerationFailed && !this.lessonData.asset[i]?.isFailedForSafetySystem){
              this.imageAsset = this.lessonData.asset[i]?.path.includes(environment.cdnUrl) ? this.lessonData.asset[i]?.path+'?d='+ this.lessonData.asset[i].timestamp : environment.cdnUrl + this.lessonData.asset[i]?.path+'?d='+ this.lessonData.asset[i].timestamp;
            }else{
              if(this.lessonStatus == 'FAILED'){
                if (this.lessonData.asset[i]?.isImageGenerationFailed && this.lessonData.asset[i]?.isFailedForSafetySystem){
                  this.imageAsset = '/assets/images/safety-image.gif';
                  this.isFailedForSafety=true;
                  this.isFailedForGeneration=true;
                }else{
                  this.imageAsset = '/assets/images/safety-image.gif';
                  this.isFailedForSafety=false;
                  this.isFailedForGeneration=true;
                }
              }
            }
            break;
          case 'audio':
            this.audioAsset = this.lessonData.asset[i].path.includes(environment.cdnUrl) ? this.lessonData.asset[i].path : environment.cdnUrl + this.lessonData.asset[i].path;
            break;
          case 'H5p':
            this.assetH5p = "";
            this.lessonData.asset[i].path = this.lessonData.asset[i]?.path && !this.lessonData.asset[i].path.includes(environment.cdnUrl) ? environment.cdnUrl + this.lessonData.asset[i].path.substring(0, this.lessonData.asset[i].path.lastIndexOf("/")) : environment.cdnUrl + this.lessonData.asset[i].path;
            this.assetH5p = await this.lessonData.asset[i]; 
            if(this.assetH5p != ""){
              this.renderH5pContent(this.assetH5p);
            }           
            break;
        } 
      }
      if(this.lessonStatus != 'IN_PROGRESS'){
        this.verifyAllAssets(this.actualAssetList);
      }
    }
  }

  setCorrectAnswerFlag(){
    return new Promise(resolve=>{
      from(this.lessonData.quiz.questions).pipe(map(question=> question['answers'].map((option, opIndex)=>{ if(!option.hasOwnProperty('isCorrect')) option.isCorrect = opIndex == 0 ? true : false}))).subscribe();
      this.activeLessonOriginalFormat = JSON.parse(JSON.stringify(this.lessonData));
      resolve('');
    })
  }

  async renderH5pContent(assetH5p){
      const el = document.getElementById('h5p-container');
      if(el){
        el.innerHTML = '';
        const options = {
          h5pJsonPath:  `${assetH5p['path']}`,
          librariesPath : `${this.h5pLibrariesPath}`,
          frameJs: `/assets/player/frame.bundle.js`,
          frameCss: '/assets/player/styles/h5p.css',
          contentUserData: [{
            state: '{"answers":"essential"}'
          }],
          xAPIObjectIRI:true
        };        
        try {       
          await new H5PStandalone(el, options);
          // await h5pStandalone.init(); 
          let H5P = window["H5P"];
          H5P.externalDispatcher.on("xAPI", (event: any) => {
          });
        } catch (error) {
          setTimeout(() => this.renderH5pContent(assetH5p), 1000); // Retry with delay
          console.error('Error while rendering H5P content:', error);
        }
      } else {
        setTimeout(() => this.renderH5pContent(assetH5p), 1000); // Retry with delay
      }
  }

  checkAnswer(questionIndex){
    let answers = this.activeLessonOriginalFormat.quiz.questions[questionIndex].answers;
    let index = answers.length;
    let isAnswerCorrect;
    for (let i = 0; i < index; i+=1) {
      if(answers[i].text === this.questionAnswer[questionIndex].answer && answers[i]['isCorrect'] == true){
        isAnswerCorrect = true;
        break;
      }
    }
    if(isAnswerCorrect == true){
      this.isAnswerCorrect[questionIndex] = true;
    }else{
      this.isAnswerCorrect[questionIndex] = false;
    }
    this.appInsightsService.logEvent('Question answer submit', {questionIndex: questionIndex, isAnswerCorrect: this.isAnswerCorrect});
  }

  resetQuiz(){
    this.questionAnswer = [{answer : null},{answer : null},{answer : null},{answer : null}];
    this.isAnswerCorrect = [null,null,null,null];
    this.appInsightsService.logEvent('Quiz reset', {questionAnswer: this.questionAnswer, isAnswerCorrect: this.isAnswerCorrect});
    this.feedbackText = [null,null,null,null];
    this.shuffleQuizOptions();
  }

  shuffleQuizOptions(){
    this.lessonData.quiz.questions.forEach(question => {
      for (let i = question.answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [question.answers[i], question.answers[j]] = [question.answers[j], question.answers[i]];
      }
    });
  }

  setFeedbackText(option, questionIndex){
    this.feedbackText[questionIndex] = option.feedback;
    this.isAnswerCorrect[questionIndex] = null;
  }

  openFileInput() {
    const image = document.getElementById('heroImage') as HTMLInputElement;
    image.click();
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if(this.validFileType(file)){
      if (file && !this.validFileSize(file)) {
        this.uploadImage(file);
        }else{
          document.getElementById('heroImage')['value'] = '';
          this.snackBarService.error("The file size exceeds the set limit of 500 KB. Please choose a smaller file for upload.");
        }
    }else{
      this.snackBarService.error("Invalid file extension.");
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

  uploadImage(file : File){
    const formData = new FormData();
    let imageDetails = {
      "courseRequestId":this.courseId,
      "type":"lesson",
      "imageName" : this.lessonData.asset[0].fileName,
      "moduleIndex":this.moduleIndex,
      "lessonIndex":this.lessonIndex
    }
    formData.append('file', file);
    formData.append('imageDto', JSON.stringify(imageDetails));
    const href = `${BaseUrl.PADHAI}/uploadImage/image`;
    this.fileUploadService.uploadFile(href, formData , 'POST').then((response :any) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageAsset = e.target.result;
      };
      reader.readAsDataURL(file); 
     let message = JSON.parse(response);
     this.snackBarService.success(message.message.applicationMessage);
     this.communicationService.newImageUploadedSubject.next(true);
   })
   .catch(error => {
     let errMessage = JSON.parse(error);
     this.snackBarService.error(errMessage.applicationMessage);
   });
  }

  getMissingAssetList(assetList): string[] {
    return this.expectedAssetTypeList.filter(value => !assetList.includes(value));
  }

  verifyAllAssets(actualAssetList){
    this.missingAssetList = this.getMissingAssetList(actualAssetList);
    this.expectedAssetTypeList.forEach(type => {       
      if(this.missingAssetList.includes(type) && type === 'audio' && this.audioAsset == null){
        this.audioAsset = false;
      } else if(this.missingAssetList.includes(type) && type === 'H5p' && this.assetH5p == ''){
        this.assetH5p = '';
      } else if(this.missingAssetList.includes(type) && type === 'image' && this.imageAsset == null){
        this.imageAsset = '/assets/images/safety-image.gif';
        this.isFailedForSafety=false;
        this.isFailedForGeneration=true;      
      }
    });
  }
   
}
