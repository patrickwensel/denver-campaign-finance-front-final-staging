import { Component, OnInit, Input } from '@angular/core';
import { LocalstorageService, CommonMethods } from 'src/app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenavcomponent',
  templateUrl: './sidenavcomponent.component.html',
  styleUrls: ['./sidenavcomponent.component.scss']
})
export class SidenavcomponentComponent implements OnInit {
  localrole: any;
  static_data: any;
  public selectedindex = 0;
  isadmin = false;
  islobby: any;
  iscover = false;
  currenturl: string = '';
  showmsg = false;
  isnoentity: any;
  hidesidenav: any;
  public index = 0;
  constructor(
    private localStore: LocalstorageService,
    private commonMethods: CommonMethods,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currenturl = this.router.url;
    console.log(this.router.url)
    this.localrole = this.localStore.getLocalStorage('user_type') || '';
    this.islobby = this.localStore.getLocalStorage('user_chosen');
    console.log('===>> lobby', this.islobby);
    this.isnoentity = this.localStore.getLocalStorage('isnoentity');
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.setSidePanel();
    this.checkRouter();
  }

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
        this.router.navigate(['/fine-and-fees/navigate']);
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
    if (splittedCommitteeRoute && splittedCommitteeRoute[0] == '/committee/committee-registration' || splittedCommitteeRoute && splittedCommitteeRoute[0] == '/lobbyist/createlobbyist' ){
      this.hidesidenav = true;
    }

    if (splittedRoute && ( splittedRoute[1] == "profile" && splittedRoute[2] == "changepassword") ) {
      this.hidesidenav = true;
    }
    if( splittedRoute && ( splittedRoute[1] == "ethics")) {
      this.hidesidenav = true;
    }
  }

  // search trans
  hideRequiredMarker: boolean = true;
  yearList: string[] = ['2020', '2019'];
  selectedReportYear = this.yearList[0];

}
