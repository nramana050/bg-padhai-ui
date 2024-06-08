
import { BlockBlobClient } from "@azure/storage-blob";
import { PadhaiService } from '../padhai.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';

export class MyUploadAdapter {

    constructor(private data, private courseId, private PadhaiService: PadhaiService, private snackBarService : SnackBarService) {}
    upload() {
      return this.data.file.then(file => {
            return new Promise((resolve, reject) => {

              if(this.validFileType(file)){
                if (file && !this.validFileSize(file)) {
                  this.PadhaiService.getSasUrl(this.courseId, file.name).subscribe(res=>{
              
                    let sasData = res.responseObject
                    this.uploadFileToAzure(file,sasData.sasUrl).then(
                      (res) => {
                        resolve({ default: sasData.fileUrl
                        });
                      },
                      (error) => {
                        reject(null);
                        this.snackBarService.error("Error encountered during image upload in rich text, please try again.");
                        console.error("Upload error:", error);
                      }
                    );
              })
                }else{
                  this.snackBarService.error("The file size exceeds the set limit of 500 KB. Please choose a smaller file for upload.");
                  reject(null);
                }
              }else{
                this.snackBarService.error("Invalid file extension.");
                reject(null);
              }
            });  
      });
    }

    async uploadFileToAzure(
      file: File,
      sasUrl: string): Promise<void> {
      const blockBlobClient = new BlockBlobClient(sasUrl);
      await blockBlobClient.uploadBrowserData(file);
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
  }