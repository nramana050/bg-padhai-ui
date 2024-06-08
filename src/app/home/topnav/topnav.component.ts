import { Component, OnInit, OnDestroy,ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
// import { SessionsService } from '../../sessions/sessions.service';
import { SnackBarService } from '../../framework/service/snack-bar.service';
import { AppInsightsService } from '../../framework/service/app-insights.service';
// import { ChatNotificationMatBadgeService } from './chatnotification/chatnotification-matbadge.service';
import { BaseUrl } from 'src/app/framework/constants/url-constants';
import { AssessmentStatusService } from 'src/app/features/shared/services/assessment-status.service';
import { ConfirmService } from 'src/app/features/shared/components/confirm-box/confirm-box.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit,AfterViewChecked {

    username: string;
    appUname:string;
    authenticatedUserRoleId:string;
    pushRightClass = 'push-right';
    pageTitle:string
    passwordToExpire = false;
    userOrganizations = [];
    currentOrganizationId: number = null;
    href = "";
    manageUsersRegexUrl = RegExp(localStorage.getItem('landingPage'));
    currentEstablismentName: any;
    logo: string;
    matBadgeHidden = false;
    matbaDge;
    chatFocus: number;
    subscription: any;
    ROUTING_PATH  = '/'+localStorage.getItem('landingPage')

    toggleDesktopMenu = false;
    isoAuthRequired:boolean = false;
    srmFlag = false;
    featureList;

    constructor(
        public router: Router,
        // private readonly sessionService: SessionsService,
        private readonly snackBarService: SnackBarService,
        private readonly appInsightsService: AppInsightsService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly assessmentStatusService: AssessmentStatusService,
        private readonly _onConfirmService: AppConfirmService,
        private readonly confirm: ConfirmService,

    ) {
        // this.appUname = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userName;
        // this.authenticatedUserRoleId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userId;
    }

    ngOnInit() {
        // this.sessionService.passwordAboutToExpiredFlag.subscribe(flag => {
        //     this.passwordToExpire = flag;
        // });
    //     if(localStorage.getItem('isoAuthRequired') === "true"){
    //         this.isoAuthRequired = true;
    //     }
        
    //    this.passwordToExpire = JSON.parse(localStorage.getItem('passwordCheck'));
    //     this.username = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userName;
    //     this.appInsightsService.setAuthenticatedUserContext(this.appUname, this.authenticatedUserRoleId);
        // this.resolveUserOrganizations();
        // this.currentOrganizationId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).orgId;
        // this.chatNotificationMatBadgeService.chatFocus.subscribe(flag=>{
        //     this.chatFocus = flag
        // });

        // this.srmGoToChatService.getUnreadMessageCount().subscribe(count =>{
        //     if(count > 0){
        //         this.matbaDge = count;
        //     }else{
        //         this.matbaDge = 0;
        //         this.matBadgeHidden = true;
        //     }
            
        // });

        //  this.subscription = this.chatNotificationMatBadgeService.isChatRead()
        //     .subscribe(isChatRead => {
        //         this.matbaDge = 0;
        //         this.matBadgeHidden = true;
        //  });
    //     this.sessionService.currentLogo.subscribe(logo => {    
       
    //     this.logo = logo +  localStorage.getItem('logoPath');
    // });
    // this.featureList =JSON.parse(atob(localStorage.getItem('token').split('.')[1])).listResource
    // this.featureList.forEach(element => {
    //     if(element.fid===14){
    //         this.srmFlag=true;
    //     }
    // });
    }
    getRoute() {
        if (this.chatFocus) {
         return 'active';
        } else {
          return '';
        }
      }

    changePassword() {
        this.router.navigate([`/user-setting/change-password`]);
    }

    onLoggedOut() {
        if(window.location.href.includes("/plan-v2/edit-plan")){
            this.assessmentStatusService.assessmentSaved$.subscribe((assessmentSaved) => {
              if (assessmentSaved) {
                // this.sessionService.signout().subscribe();
              } else {
                const dialogRef = this._onConfirmService.confirm({
                  title: `Exit Plan`,
                  message: `Please save your plan before logging out.`,
                  showOkButtonOnly: true,
                });
                return this.confirm.navigateSelection;
              }
            });
        }else{
            // this.sessionService.signout().subscribe();
        }
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    resolveUserOrganizations() {
        // this.sessionService.getClientOrganizations().subscribe(userOrganizations => {
        //     this.userOrganizations =  userOrganizations;
        //     this.currentEstablismentName = userOrganizations.filter(item => item.id ===
        //         +JSON.parse(atob(localStorage.getItem('token').split('.')[1])).orgId)[0].orgName;

        // })
    }

    onChangeEstablishment(organization) {
        const estbId = organization.id;
        // this.sessionService.changeEstablishment(estbId).subscribe(response => {
        //     const successString = 'Establishment switched to';
        //     this.currentOrganizationId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).orgId;
        //     this.router.navigate([this.ROUTING_PATH]);
        //     this.currentEstablismentName = organization.orgName;
        //     this.snackBarService.success(`${successString} `+ organization.orgName);

        //     this.href = this.router.url;
        //     if (this.manageUsersRegexUrl.test(this.href)) {
        //         this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        //         this.router.navigate([this.ROUTING_PATH]));
        //     }
        // }, error => {
        //     this.snackBarService.error(error);
        // })
    }

    getBaseUrl() {
      return this.ROUTING_PATH;
    }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
      }

    toggleDesktop(){
        this.toggleDesktopMenu = !this.toggleDesktopMenu;

        if(this.toggleDesktopMenu){
            for (let i = 0; i < Array.from(document.getElementsByClassName('itemName')).length; i++) {
                document.getElementsByClassName('itemName')[i]['style'].display = 'none'; 
                document.getElementsByClassName('mat-icon')[i]['style'].marginRight = '0px';    
            }     
            document.querySelector('nav')['style'].width = 'auto';
            document.querySelector('nav')['style'].overflowX = 'hidden';
            document.getElementsByClassName('main-container')[0]['style'].marginLeft = '60px'; 
        }else{
            for (let i = 0; i < Array.from(document.getElementsByClassName('itemName')).length; i++) {
                document.getElementsByClassName('itemName')[i]['style'].display = 'block'; 
                document.getElementsByClassName('mat-icon')[i]['style'].marginRight = '10px';    
            }     
            document.querySelector('nav')['style'].overflowX = 'hidden';
            document.getElementsByClassName('main-container')[0]['style'].marginLeft = 'calc(250px + 8px)';  
        }
    }
}
