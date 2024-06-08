// import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
// import { FileUploadOptions, FileError } from './file-upload.options';
// import { NgxDropzoneComponent } from 'ngx-dropzone';

// export interface ErrorInput {
//   id: ('filesize' | 'filetype'),
//   message: string
// }

// @Component({
//   selector: 'file-upload',
//   templateUrl: './file-upload.component.html',
//   styleUrls: ['./file-upload.component.scss']
// })
// export class FileUploadComponent implements OnChanges {

//   @Input() option: FileUploadOptions;
//   @Input() disabled: boolean;
//   @Input() showSelector: boolean;
//   @Input() showReset: boolean;
//   @Input() required: boolean;
//   @Input() errorInput: ErrorInput[] = [];

//   @Output() fileSelected: EventEmitter<File[]> = new EventEmitter();

//   @ViewChild('dropzone', {static:false}) dropzone: NgxDropzoneComponent;

//   fileList: File[] = [];
//   errors: FileError[] = [];
//   defaultErrorInput: ErrorInput[] = [
//     { id: 'filesize', message: 'File size too big, unable to upload' },
//     { id: 'filetype', message: 'File type not allowed' }
//     ];


//   constructor() { }

//   ngOnChanges(changes: SimpleChanges): void { }

//   onFilesDropped(files: File[]) {
//     this.errors = [];
//     for (const file of files) {
//       if(file.name.length >100) {
//         this.errors.push(new FileError(file, 'File name too large. Maximum file name length is 100 characters. Please rename and upload again'));
//         continue;
//       }
//       if (!this.isValidFileSize(file)) {
//         files.splice(files.indexOf(file));
//         this.errors.push(new FileError(file, this.injectedErrorMessage('filesize')));
//         continue;
//       }
//       if (!this.option.acceptAllFiles && !this.isValidFileType(file)) {
//         files.splice(files.indexOf(file));
//         this.errors.push(new FileError(file, 'File type not allowed'));
//         continue;
//       }
//       this.addToFileList(file);
//     }
//     if (!this.option.multiple && (this.errors.length > 0)) {
//       this.fileList = [];
//     }
//     this.fileSelected.next(this.fileList);
//   }

//   addToFileList(file: File) {
//     if (!this.option.multiple) {
//       this.fileList = [];
//     }
//     this.fileList.push(file);
//   }

//   removeFile(file: File) {
//     this.fileList.splice(this.fileList.indexOf(file));
//     if(this.required && this.fileList.length === 0) {
//       this.errors.push(new FileError(null, 'File is manadatory'))
//     }
//     this.fileSelected.emit(this.fileList);
//   }

//   private injectedErrorMessage(id: 'filesize' | 'filetype') {
//     if (this.errorInput.length > 0) {
//       const one = this.errorInput.find(one => one.id === id);
//       return one ? one.message : this.defaultErrorMessage(id);
//     }
//     return this.defaultErrorMessage(id);
//   }

//   private defaultErrorMessage(id: 'filesize' | 'filetype') {
//     const one = this.defaultErrorInput.find(one => one.id === id);
//     return one ? one.message : null;
//   }


//   isValidFileType(file: File) {
//     let check = false;
//     if (!this.option.accept) {
//       return true;
//     }
//     if (file.type !== '') {
//       check = this.option.accept.includes(file.type);
//     } else {
//       const format = file.name.split('.').pop();
//       check = this.option.formats.includes(format.toLowerCase());
//     }

//     return check;
//   }

//   isValidFileSize(file: File) {
//     if (this.option.maxFileSize) {
//       return !(file.size > this.option.maxFileSize);
//     }
//     return true;
//   }

//   getMaxFileSize() {
//     let size = this.getMaxFileSizeInKB(this.option.maxFileSize);
//     if (size < 1024) {
//       return size.toFixed(2) + ' KB';
//     }
//     size = this.getMaxFileSizeInMB(size);
//     if (size < 1024) {
//       return size.toFixed(2) + ' MB';
//     }
//     size = this.getMaxFileSizeInGB(size);
//     return size.toFixed(2) + ' GB';
//   }

//   getMaxFileSizeInKB(sizeInBytes: number) {
//     return sizeInBytes / 1024;
//   }

//   getMaxFileSizeInMB(sizeInKB: number) {
//     return sizeInKB / 1024;
//   }

//   getMaxFileSizeInGB(sizeInGB: number) {
//     return sizeInGB / 1024;
//   }

// }
