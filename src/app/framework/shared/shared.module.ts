import { NgModule } from '@angular/core';
import { SnackBarService } from '../service/snack-bar.service';
import { MaterialModule } from '../material/material.module';
import { AppInsightsService } from '../service/app-insights.service';
import { RoutePartsService } from '../service/route-parts.service';
import { AppConfirmModule } from '../components/app-confirm/app-confirm.module';
import { ListLabelComponent } from '../components/list-label/list-label.component';
import { FormControlMessagesModule } from '../components/form-control-messages/form-control-messages.module';
import { StepperNavigationModule } from '../../features/shared/components/stepper-navigation/stepper-navigation.module';
import { CanDeactivateGuard } from '../guards/can-deactivate/can-deactivate.guard';
import { ImagePickerModule } from '../components/image-picker/image-picker.module';



@NgModule({
    declarations: [ListLabelComponent, ],
    imports: [MaterialModule , AppConfirmModule, StepperNavigationModule, FormControlMessagesModule , ImagePickerModule],
    exports: [ListLabelComponent,  StepperNavigationModule, FormControlMessagesModule , ImagePickerModule],
    providers: [SnackBarService, AppInsightsService , RoutePartsService, CanDeactivateGuard]

})
export class SharedModule {


}
