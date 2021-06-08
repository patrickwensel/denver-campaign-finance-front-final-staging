import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MasterDataService, LocalstorageService, CommonMethods, ErrorMessageService, SnackbarService } from '../../../core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})

export class HomeLayoutComponent implements OnInit {

  static_data: any;
  showProfile: boolean =false;
  hideSideBar = false;
  public selectedindex = 0;
  noentity : any;
  currenturl: string = '';
  showNoentityMsg : any;
  localrole: any;
  isadmin = false;
  islobby: any;
  iscover = false;
  showmsg = false;
  isnoentity: any;
  hidesidenav: any;
  public index = 0;

  constructor(
    private masterData: MasterDataService,
    private localStore: LocalstorageService,
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public router: Router,
    public errorService: ErrorMessageService,
    public snackbar: SnackbarService,

  ) { }

  ngOnInit() {
    // this.noentity = this.localStore.getLocalStorage('isnoentity');
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.localrole = this.localStore.getLocalStorage('user_type');
    if (this.localrole == 'Admin') {
      this.isadmin = true;
    } else {
      this.isadmin = false;
    }

    // this.masterData.currentUser = this.localStore.getLocalStorage(this.masterData.keyUserName) || '';
  }

  changePwd() {
    console.log('router cmae');
    this.hideSideBar = true;
    this.router.navigate(['/profile/changepassword']);
  }

  closedrpdwn() {
    console.log('directive came');
    this.showProfile = true;
  }

  logout() {
    this.localStore.clearAllStorage();
    this.snackbar.snackbarError("Logged Out Successfully!!", 'center');
    this.router.navigate(['/login']);
  }
  goToHelp() {
    this.router.navigate(['/help']);
  }
  // clickedlabel(index: any ) {
  //   console.log('====>', index)
  //   this.selectedindex = index;
  // }

  switchCommittee(){
    this.router.navigate([this.masterData.switchScreenNav])
  }
  // checkRouter() {
  //   const splittedRoute = this.currenturl?.split('/');
  //   if (splittedRoute && splittedRoute[1] == 'switch') {
  //     this.showNoentityMsg = true;
  //   }
  // }


  setSelectedIndex(e) {
    // this.selectedindex
    console.log('mesaage', e);
    // if(this.localrole == 'admin') {
    this.router.navigate(['/manage/messages']);
    this.selectedindex = e;
    // }
  }

  clickedAdminlabel( navigate) {
    switch (navigate) {
      case 'managecomittee':
        this.router.navigate(['/manage/manage_committee']);
        break;
      case 'reviewFilling':
        this.router.navigate(['/']);
        break;
      case 'finesandfees':
        this.router.navigate(['/']);
        break;
      case 'message':
        this.router.navigate(['/manage/messages']);
        break;
      case 'systemManagement':
        this.router.navigate(['/system/Management']);
        break;
      case 'calender':
        this.router.navigate(['/calendar/calendar']);
        break;
    }
  }

  clickedlabel(index, navigate) {
    this.selectedindex = index;
    switch (navigate) {
      case 'filling':
        this.router.navigate(['/dashboard/candidate']);

        break;
      case 'committeeinfo':
        this.router.navigate(['/committee-info-dashboard']);

        break;
      case 'fineandfees':
        this.router.navigate(['/fine-and-fees']);

        break;
      case 'committeeinfo':
        this.router.navigate(['/']);

        break;
      case 'message':
        this.router.navigate(['/manage/messages']);

        break;
        case 'public':
          this.router.navigate(['/Public/Public-layout']);
          break;
      case 'calender':
        this.router.navigate(['/calendar/calendar']);
        break;
      case 'registration':
        this.router.navigate(['/']);
        break;
    }

  }
  // callall(value: any, tab: string) {
  //   this.clickedlabel(value);
  //   if(tab=='filling'){
  //     this.router.navigate(['/dashboard/candidate']);
  //   }
  // }

  setSidePanel() {
    this.localrole = this.localStore.getLocalStorage('user_type');
    if (this.localrole == 'Admin') {
      this.isadmin = true;
    } else  {
      this.isadmin = false;
    }
    if(this.localrole == 'Foreign City Employee') {
      this.iscover = true
    } else {
      this.iscover = false;
    }
  }
  checkRouter() {
    const splittedRoute = this.currenturl?.split('/');
    const splittedCommitteeRoute = this.currenturl?.split('?');
    if (splittedRoute && splittedRoute[1] == 'dashboard') {
      this.showmsg = true;
    }
    if (splittedRoute && ( splittedRoute[1] == 'switch' || splittedRoute[2] == 'committee-registration' || splittedRoute[2] == 'createlobbyist') ) {
      this.hidesidenav = true;
    }
    if (splittedCommitteeRoute[0] == '/committee/committee-registration' || splittedCommitteeRoute[0] == '/lobbyist/createlobbyist' ){
      this.hidesidenav = true;
    }

    if (splittedRoute && ( splittedRoute[1] == "profile" && splittedRoute[2] == "changepassword") ) {
      this.hidesidenav = true;
    }
    if( splittedRoute && ( splittedRoute[1] == "ethics")) {
      this.hidesidenav = true;
    }
  }

  changeProfile(){
    this.showProfile = !this.showProfile;
  }

}
