
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { PadhaiService } from '../padhai.service';
import { CommunicationService } from '../../../framework/service/communication.service';
import { FileUploadService } from '../../shared/components/file-upload/file-upload.service';
import { HttpClient } from '@angular/common/http';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-learning-outcomes',
  templateUrl: './learning-outcomes.component.html',
  styleUrls: ['./learning-outcomes.component.scss']
})
export class LearningOutcomesComponent implements OnInit, OnChanges {

  @Input() courseId : any;
  @Input() activeLanguage : any;
  @Input() editMode : boolean = false;
  @Input() retryLearningOutcome : boolean = false;
  @Input() licenceExceeded : boolean = false;

  @Output() isOutcomeSaved : EventEmitter<boolean> = new EventEmitter();
  @Output() learningOutcomeStatus : EventEmitter<string> = new EventEmitter();
  @Output() generateAssetButtonClicked : EventEmitter<any> = new EventEmitter();
  
  courseStatus : any;
  courseStage : any;
  courseDetails : any;
  learningOutcomes : any;
  learningOutcomesInputValue : any;
  learningOutcomesForm : FormGroup;
  showLoader : boolean = true;
  loadingScreenMessage = "Please wait";
  disableButtons = false;
  loaderUrl = '../../../../assets/CAPTR-nobg.gif'


  constructor(  private readonly http: HttpClient,
    private _fb: FormBuilder,
    private readonly padhaiService: PadhaiService,
    private readonly activeroute: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly dialog: MatDialog,
    private readonly appConfirmService: AppConfirmService,
    private readonly communicationService : CommunicationService,
    private readonly fileUploadService: FileUploadService) {}

 async ngOnInit() {
    if(localStorage.getItem('identifier') === 'RWH') {
      this.loaderUrl = '../../../../assets/Reed.png';
    }
    this.getCourseStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.retryLearningOutcome){
      setTimeout(() => {
        this.getCourseStatus(); 
      }, 500);
    }
  }

  async prepareLearningOutcomeDetails(){
      await this.getCourseData();
      this.prepareLearningOutcomsForm();
  }

  get outcomes(): FormArray {
    return this.learningOutcomesForm.get('outcomes') as FormArray;
  }

  prepareLearningOutcomsForm(){
    this.learningOutcomesForm = this._fb.group({
      outcomes: this._fb.array([]),
    });
    if(this.learningOutcomes && this.learningOutcomes.length > 0){
      for (const outcome of this.learningOutcomes) {
        this.outcomes.push(this._fb.control(outcome,[Validators.required]));
      }
    }else{
      this.outcomes.push(this._fb.control("",[Validators.required]));
    }
    this.showLoader = false;
  }

  getCourseStatus(){
    if(window.location.href.includes("/edit-content/")){
      this.padhaiService.getCourseStatus(this.courseId).subscribe(statusData=>{      
        if(statusData){
          if(statusData.outcomeStatus) this.courseStatus = (statusData?.courseStatus.replace(/\s/g, '') + statusData?.outcomeStatus.replace(/\s/g, '')).toLowerCase();
          this.courseStage = statusData.courseStatus;
          this.performActionOnOutcomeStatus();
        }
      })
    }
  }

 async performActionOnOutcomeStatus(){
  
    if(this.courseStage == "Asset" || this.courseStage == 'Publish'){
      await this.getCourseData();
      this.showLoader = false;
    }else{
      switch (this.courseStatus) {
        case 'outcomegenerated':
          this.prepareLearningOutcomeDetails();
          this.learningOutcomeStatus.emit("Generated");
          break;
        case 'outcomeinprogress':
          this.showLoader = true;
          this.loadingScreenMessage = "Learning outcomes generation is in progress, please wait or come back later.";
          setTimeout(() => {
            this.getCourseStatus();
          }, 2000);
          break;
        case 'outcomefailed':
          this.showLoader = true;
          this.loadingScreenMessage = "We're running a bit behind schedule with generating outcomes right now. Please give us a little more time and regenerate shortly.";
          this.learningOutcomeStatus.emit("Failed");
          break;
      
        default:
          break;
      }
    }
  }

  getCourseData(){
    return new Promise(resolve=>{
      this.padhaiService.getLessonRequest(this.courseId, this.activeLanguage || 'ENGLISH').subscribe(courseData=>{
        this.courseDetails = courseData;
        this.learningOutcomes = courseData?.outcomeDetails.outcomes || [];
        resolve("");
      },err=>{
        resolve("");
      })
    })
  }

  editOutcomes(){
    this.editMode = !this.editMode;
  }

  reOrderOutcomes(event: CdkDragDrop<string[]>) {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;
    const movedItem = this.outcomes.at(previousIndex);
    this.outcomes.removeAt(previousIndex);
    this.outcomes.insert(currentIndex, movedItem);
  }

  deleteOutcome(outcomeIndex){
    const deleteLearningOutcome = this.appConfirmService.confirm({ title: `Delete Learning Outcome`,message: 'Are you sure you want to delete this outcome?' });
    deleteLearningOutcome.subscribe(result=>{
      if(result) this.outcomes.removeAt(outcomeIndex);
    });
  }

  addLearningOutcome(){
    if(this.outcomes.length< 7) this.outcomes.push(this._fb.control("",[Validators.required]));
  }

  saveLearningOutcomes(){
    this.disableButtons = true;
    this.courseDetails.outcomeDetails.outcomes = this.outcomes.value;
    this.padhaiService.saveLearningOutcomesAsDraft(this.courseDetails).subscribe(res=>{
      this.snackBarService.success(res.message.applicationMessage);
      this.isOutcomeSaved.emit(true);
      this.disableButtons = false;
    },err=>{
      this.disableButtons = false;
      this.snackBarService.error(err.error.message);  
    })
  }

  generateAsset(){
    this.showLoader = false
    this.disableButtons = true;
    this.courseDetails.outcomeDetails.outcomes = this.outcomes.value;
    this.padhaiService.saveLearningOutcomesAsDraft(this.courseDetails).subscribe(res=>{
      this.learningOutcomes = this.courseDetails.outcomeDetails.outcomes;
      this.courseStage = 'Asset';
      this.generateAssetButtonClicked.emit(this.outcomes.value);
    },err=>{
      this.disableButtons = false;
    })
  }

}
