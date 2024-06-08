import { NgModule } from '@angular/core';
import { AppConfirmService } from './app-confirm.service';
import { AppConfirmComponent } from './app-confirm.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
    imports: [ CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatRadioModule ],
    declarations: [AppConfirmComponent],
    providers: [AppConfirmService],
    entryComponents: [AppConfirmComponent],
    exports: [ AppConfirmComponent ]
  })
  export class AppConfirmModule { }
