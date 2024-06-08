import { Component, EventEmitter, Input, OnInit, Output , OnChanges} from '@angular/core';
// import { ErrorInput } from 'src/app/features/shared/components/file-upload/file-upload.component';
import { FileError } from 'src/app/features/shared/components/file-upload/file-upload.options';

@Component({
  selector: 'image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit , OnChanges  {

  imageLoaded: boolean = false;
  loaded: boolean = false;
  imageSrc: string = '';
  displayDefaultImage:boolean = false;
  fileTypes = ['image/jpeg', 'image/jpg' , 'image/png'];
  message:string = 'Not a valid file type';
  isValidFileType:boolean = true;


  @Input() maxImgeSizeInMB: string;
  @Input() enableDefaultImage: boolean;
  @Input() imageUrlOrData: string;
  @Input() maxFileSize:number;
  @Input() isReadOnly:boolean;

  @Output('onFileSelected') onFileSelected:EventEmitter<File> = new EventEmitter<File>();
  
  
  errors: FileError[] = [];
  // defaultErrorInput: ErrorInput[] = [
  //   { id: 'filesize', message: 'File size too big, unable to upload' },
  //   { id: 'filetype', message: 'File type not allowed' }
  // ];
  
  constructor() { 
  }

  ngOnInit() { 
  
  }
  ngOnChanges(){
    this.imageSrc = this.imageUrlOrData;
  }

  handleImageLoad() {
    this.imageLoaded = true;
  }
 

  handleInputChange(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if(this.validFileType(file)){
      this.errors = [];
      const reader = new FileReader();
      this.loaded = false;
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
      this.onFileSelected.emit(file);
    }
}

  handleReaderLoaded(e) {
    console.log("_handleReaderLoaded")
    const reader = e.target;
    this.imageSrc = reader.result;
    this.loaded = true;
    this.onFileSelected.emit(e);
 }
  cancel(){
       this.imageSrc="null"
       this.loaded = false;
       this.onFileSelected.emit(null);
  }

  validFileType(file):boolean {
    for (let i = 0; i < this.fileTypes.length; i++) {
      if (file.type === this.fileTypes[i]) {
          this.isValidFileType = true;
          return true;
         
      }
    }
    this.errors = [];
    this.errors.push(new FileError(file, 'File type not allowed')); 
    return false;
  }


  isValidFileSize(file: File) {
    if (this.maxFileSize) {
      this.errors = [];
      // this.errors.push(new FileError(file, this.injectedErrorMessage('filesize')));
      return !(file.size > this.maxFileSize);
    }
    return true;
  }

  private injectedErrorMessage(id: 'filesize' | 'filetype') {
    // if (this.defaultErrorInput.length > 0) {
    //   const one = this.defaultErrorInput.find(one => one.id === id);
    //   return one ? one.message : this.defaultErrorMessage(id);
    // }
    return this.defaultErrorMessage(id);
  }

  private defaultErrorMessage(id: 'filesize' | 'filetype') {
    // const one = this.defaultErrorInput.find(one => one.id === id);
    // return one ? one.message : null;
  }


}
