import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { PadhaiService } from '../padhai.service';
import { AppInsightsService } from '../../../framework/service/app-insights.service';

@Component({
  selector: 'app-translate-popup',
  templateUrl: './translate-popup.component.html',
  styleUrls: ['./translate-popup.component.scss']
})
export class TranslatePopupComponent implements OnInit {

  courseId : any;
  refLanguageData = [];
  languageData = [];
  languageSelection = new FormGroup({
    languageName :new FormControl('',Validators.required),
    genderId : new FormControl('',Validators.required)
  })
  languageOptions: Observable<string[]>;
  
  selectedLanguages = {languages : []};
  @ViewChild(MatAutocompleteTrigger) autoTrigger: MatAutocompleteTrigger;
  submitedLanguages = [];
  initialSelectedLanguages = [];

  disableSubmitButton = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly padhaiService :PadhaiService,
    private readonly dailogRef: MatDialogRef<TranslatePopupComponent>,
    private readonly snackBarService: SnackBarService,
    private readonly appInsightsService: AppInsightsService) {
    this.courseId = data.id;
    this.selectedLanguages['courseId'] = this.courseId;
  }

 async ngOnInit(): Promise<void> {
   await this.getLanguageRefData();
    this.getSelectedLanguagesData();
    
  }

  getSelectedLanguagesData(){
      this.padhaiService.selectedLanguagesData(this.courseId).subscribe(languages=>{
        this.initialSelectedLanguages = JSON.parse(JSON.stringify(languages));
        this.submitedLanguages = languages;
        this.selectedLanguages.languages.unshift(...this.submitedLanguages)
        this.checkExistingLanguages(languages);
      })
  }

  getLanguageRefData(){
    return new Promise(resolve=>{
      this.padhaiService.getLaunguage().subscribe(res=>{
        res.shift();
        this.refLanguageData = JSON.parse(JSON.stringify(res));
        this.languageData = JSON.parse(JSON.stringify(res))
        this.prepareData()
        resolve(null)
      },err=>{
        resolve(null)
      });
    })
  }

  prepareData(){
    this.languageOptions = this.languageSelection.get('languageName').valueChanges.pipe(
      startWith(''),
      map(value => this.languageData.filter(option => option.language.toLowerCase().includes(value.toLowerCase())))
    );
  }

  resetLanguage(){
    this.languageSelection.get('languageName').setValue('');
    this.autoTrigger.closePanel();
    setTimeout(() => this.autoTrigger.openPanel());
  }

  addLanguage(formData){
    console.log(formData, "add lang")
    let languageData = formData;
    languageData['languageId'] = this.refLanguageData.filter(option => option.language == formData.languageName)[0]['id'];
    languageData['genderId'] = parseInt(formData.genderId)
    this.appInsightsService.logEvent('Add language', {languageData: languageData, courseId: this.courseId});
    this.selectedLanguages.languages.push(languageData);
    this.resetForm(formData);
  } 

  resetForm(languageData){
    let length = this.languageData.length;
    for (let i = 0; i < length; i+=1) {
      if(this.languageData[i].language.toLowerCase().includes(languageData.languageName.toLowerCase())){
        this.languageData.splice(i,1);
        break;
      } 
    }
    this.languageSelection.get('languageName').setValue('');
    this.languageSelection.get('genderId').setValue('');
    Object.keys(this.languageSelection.controls).forEach(key => {
      this.languageSelection.get(key).clearValidators();
      this.languageSelection.get(key).updateValueAndValidity();
    });
  }

  removeSelectedLang(language){
    this.appInsightsService.logEvent('Remove selected language', {language: language, courseId: this.courseId});
    const index = this.selectedLanguages.languages.indexOf(language);
    this.selectedLanguages.languages.splice(index, 1);
    this.languageData.push({id:language.id,language:language.languageName})
    this.prepareData();
  }

  generateLanguages(){
    this.disableSubmitButton = true;
    let payload = {...this.selectedLanguages}
    payload.languages = this.selectedLanguages.languages.filter(selectedLanguages => {
      return !this.initialSelectedLanguages.some(langSelected => langSelected.languageName === selectedLanguages.languageName);
    });
    this.padhaiService.generateLanguages(payload).subscribe(res=>{
      this.snackBarService.success(res.message.applicationMessage);
      this.dialogClose(true);
      this.appInsightsService.logEvent('Translation is in progress', {res: res, courseId: this.courseId});
    },err=>{
      this.appInsightsService.logEvent('Translation is Failed', {err: err, courseId: this.courseId});
      this.disableSubmitButton = false;
      this.dialogClose(false);
      this.snackBarService.error(err.error.applicationMessage);
    })
  }

  dialogClose(isLanguageAdded = false){
    this.appInsightsService.logEvent('Dialog Close', {isLanguageAdded: isLanguageAdded, courseId: this.courseId});
    this.dailogRef.close(isLanguageAdded);
  }

  checkExistingLanguages(languages){
    this.languageData = this.languageData.filter(langRef => {
      return !languages.some(langSelected => langSelected.languageName === langRef.language);
    });
    this.prepareData();
  }
}
