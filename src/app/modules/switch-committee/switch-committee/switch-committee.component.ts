import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonMethods, MasterDataService, ErrorMessageService, MasterUrlService, SnackbarService, LocalstorageService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogConfirmationComponent} from './../../../shared/components/dialog-confirmation/dialog-confirmation.component'
@Component({
  selector: 'app-switch-committee',
  templateUrl: './switch-committee.component.html',
  styleUrls: ['./switch-committee.component.scss']
})
export class SwitchCommitteeComponent implements OnInit {
  hideCommitteeLobbyList: boolean = true;

  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm alert before navigating away
    if (!!this.chooseCommitte || !!this.chooseLobbiest || !!this.chooseIE) {
      if (!this.showWhichCommId || ((this.showWhichCommId != this.chooseCommitte) && (this.showWhichCommId != this.chooseLobbiest) && (this.showWhichCommId != this.chooseIE))) {
        return false
      }
    }
    return true;
  }

  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
        $event.returnValue = "This message is displayed to the user in IE and Edge when they navigate without using Angular routing (type another URL/close the browser/etc)";
    }
  }
  @HostListener('window:popstate', ['$event'])
  onPopState($event) {
    if (!this.canDeactivate()) {
      // return this.openDialog();
      // $event.returnValue = "This message is displayed to the user in IE and Edge when they navigate without using Angular routing (type another URL/close the browser/etc)";
    }
  }
  hideRequiredMarker: boolean = true;
  userId: any;
  committeeId: any;
  chooseCommitte: any;
  chooseLobbiest: any;
  chooseIE: any;
  //Committee
  getCommitteeList: any;
  getLobbyList: any;
  getIndipendentList: any = [];
  selectedCommLobbList: any = [];
  filerType: any ;

  committeeList: any = [{ committeeId: 1, committeeName: "sample 1" }, { committeeId: 2, committeeName: "sample 2" }, { committeeId: 3, committeeName: "sample 3" }];
  LobbyList: any = [{ lobbyId: 1, lobbyName: "sample 1" }, { lobbyId: 2, lobbyName: "sample 2" }, { lobbyId: 3, lobbyName: "sample 3" }]
  // localStore: any;
  // masterDate: any;
  // commonMethods: any;
  static_data: any;
  switchInformationForm: any;
  committeDetail: any;
    // {
    //   "id": 1,
    //   "name": "Test Committee 1",
    //   "type": "COM-IC",
    //   "candidateName": "John Smith",
    //   "treasurerName": "John Smith",
    //   "electionDate": "2021-03-02T00:00:00",
    //   "publicFundingStatus": null
    // };
  committeeLobbyList: any = {
    "committees": [
      // {
      //   "committeeID": 1,
      //   "committeeName": "test"
      // }
    ],
    "lobbyists": [
      // {
      //   "lobbyistID": 1,
      //   "lobbyistName": "test"
      // }
    ],
    "independentExp": [
      // {
      // "IndependentSpenderID": "1",
      // "IndependentSpenderName": "test"
      // }
    ],
    "userType": "candidate"
  };
  showJoinCommittee: boolean = false;
  showJoinIndipendent: boolean = false;
  showJoinLobby: boolean = false;
  showNewIndipendent: boolean = false
  listData: any;
  hideNext: boolean;
  selectCommittee: any;
  role: string;
  note: any = '';
  showOtherFiler = false;
  showAllFilter: any = false;
  showWhichComm: any = '';
  showWhichCommId: any;
  fromlogin: boolean;
  showScuccess: boolean = false;
  email: any;
  message: string;
  notify: string;
  type: any;

  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    private service: ClientService,
    private urlService: MasterUrlService,
    public snackbar: SnackbarService,
    private localStore: LocalstorageService,
    public router: Router,
    public dialog: MatDialog,
  ) {
    this.fromlogin = this.localStore.getLocalStorage('fromlogin');

    //   this.fN =localStorage.getItem('firstName');
    //   this.lN =localStorage.getItem('lastName');
    //   this.fullName = (this.fN + this.lN).replace(/"/g, " ");
    //   console.log(this.fullName)
    this.email = this.localStore.getLocalStorage('email');

  }

  ngOnInit(): void {
    //For testing
    //  this.chooseCommitte = this.committeeLobbyList.committeelist[0]?this.committeeLobbyList.committeelist[0].committeeID: '';
    //  this.chooseLobbiest = !this.chooseCommitte && this.committeeLobbyList.lobbyistlist[0]?this.committeeLobbyList.lobbyistlist[0].lobbyistID: '';
    //  this.chooseIE = (!this.chooseCommitte && !this.chooseLobbiest) && this.committeeLobbyList.ielist[0]?this.committeeLobbyList.ielist[0].IndependentSpenderID: '';

    this.getInit();
    this.initSwitchForm();
    this.getCommitteeLobbyList();
    this.getCommittee();
    this.getLobby();
    this.getOtherFilerDetails();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: { heading: "Confirmation" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.navigatePage();
      }
    });
  }
  getOtherFilerDetails () {
    let nav_sw = this.router?.url?.split('/')[2];
    if(nav_sw == 'nav-switch'){
      this.showOtherFiler = true;
      this.showAllFilter = false;
      let curr_Comm = this.localStore.getLocalStorage('user_chosen');
      this.showWhichComm = curr_Comm?curr_Comm:'';
      this.showWhichCommId = this.localStore.getLocalStorage('choosen_id');
      // let whichComm = this.showWhichComm == 'Lobbyist'? 'Lobbyist':this.showWhichComm;
      this.filerType = this.showWhichComm;
      if(curr_Comm){
      if(this.showWhichComm == 'committee'){
        this.chooseCommitte = parseInt(this.showWhichCommId);
        this.onChangeCommittee({contactId:parseInt(this.showWhichCommId)});
      } else if(this.showWhichComm == 'Lobbyist'){
        this.chooseLobbiest = parseInt(this.showWhichCommId);
        this.onChangeLobby({contactId:parseInt(this.showWhichCommId)});
      }  else if(this.showWhichComm == 'ie'){
        this.chooseIE = parseInt(this.showWhichCommId);
        this.onChangeIE({contactId:parseInt(this.showWhichCommId)});
      }
    } else {
      this.showAllFilter = true;
    }
      // this.getCommitteeLobbyDetail(parseInt(this.showWhichCommId),whichComm);
    } else {
      this.showAllFilter = true;
    }
  }

  getInit() {
    if (!this.userId)
      this.userId = this.localStore.getLocalStorage(this.masterDate.userId);

    this.userId = parseInt(this.userId);
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    // this.userId = 3;

  }

  getCommitteeLobbyList() {
    this.hideCommitteeLobbyList = true;
    this.service.getData(this.urlService.getUserEntities).subscribe((res) => {
      this.committeeLobbyList = res;
      this.hideCommitteeLobbyList = false;
      // if (this.committeeLobbyList && this.committeeLobbyList. committees.length && !this.showOtherFiler) {
      //   this.chooseCommitte = this.committeeLobbyList.committeelist[0].committeeID;
      // } else if (this.committeeLobbyList && this.committeeLobbyList. lobbyists.length && !this.showOtherFiler) {
      //   this.chooseLobbiest = this.committeeLobbyList.lobbyistlist[0].lobbyistID;
      // } else if (this.committeeLobbyList && this.committeeLobbyList. independentExp.length && !this.showOtherFiler) {
      //   this.chooseIE = this.committeeLobbyList.ielist[0].IndependentSpenderID;
      // }
      // this.chooseCommitte = this.committeeLobbyList.committeelist[0]?this.committeeLobbyList.committeelist[0].committeeID: '';
      // this.chooseLobbiest = !this.chooseCommitte && this.committeeLobbyList.lobbyistlist[0]?this.committeeLobbyList.lobbyistlist[0].lobbyistID: '';
      // this.chooseIE = (!this.chooseCommitte && !this.chooseLobbiest) && this.committeeLobbyList.ielist[0]?this.committeeLobbyList.ielist[0].IndependentSpenderID: '';

      let curr_Comm = this.localStore.getLocalStorage('user_chosen');
      this.showWhichComm = curr_Comm?curr_Comm:'';
      this.showWhichCommId = this.localStore.getLocalStorage('choosen_id');
      // let whichComm = this.showWhichComm == 'Lobbyist'? 'Lobbyist':this.showWhichComm;
      this.filerType = this.showWhichComm;
      if(curr_Comm && this.showWhichCommId){
      if(this.showWhichComm == 'committee'){
        this.chooseCommitte = parseInt(this.showWhichCommId);
        this.onChangeCommittee({contactId:parseInt(this.showWhichCommId)});
      } else if(this.showWhichComm == 'Lobbyist'){
        this.chooseLobbiest = parseInt(this.showWhichCommId);
        this.onChangeLobby({contactId:parseInt(this.showWhichCommId)});
      }  else if(this.showWhichComm == 'ie'){
        this.chooseIE = parseInt(this.showWhichCommId);
        this.onChangeIE({contactId:parseInt(this.showWhichCommId)});
      }
    } else if(this.chooseCommitte){
      this.onChangeCommittee({contactId:parseInt(this.chooseCommitte)});
    }
    else if(this.chooseLobbiest){
      this.onChangeLobby({contactId:parseInt(this.chooseLobbiest)});
    }
    else if(this.chooseIE){
      this.onChangeIE({contactId:parseInt(this.chooseIE)});
    }
    })

  }

  getCommitteeLobbyDetail(id: any, type: any, url:any) {
    this.service.getData(url+'?entityId='+id+'&entityType='+type).subscribe((res) => {
      this.committeDetail = res;
    })
  }

  initSwitchForm() {
    // this.switchInformationForm = new FormGroup({
    //   committeeId: new FormControl('' || null, []),
    // });
  }

  //   api/UserManagement/UpdateIEFAdditionalInfo
  // {"userID":505,"userTypeId":"USER-IEF","filerType":"FT-ORG","occupation":"","employer":"ewrer"

  onChangeCommittee(details: any) {
    this.chooseLobbiest = '';
    this.chooseIE = '';
    this.chooseCommitte = details.contactId;
    this.filerType = 'committee';
    details.entityType = 'AC-CAN';
    this.getCommitteeLobbyDetail(details.contactId, details.entityType,this.urlService.getUserEntitiesDetails);
  }

  onChangeLobby(details: any) {
    this.chooseCommitte = '';
    this.chooseIE = '';
    this.chooseLobbiest =details.contactId;
    this.filerType = 'Lobbyist';
    details.entityType = 'AC-LOB';
    this.getCommitteeLobbyDetail(details.contactId, details.entityType,this.urlService.getUserEntitiesDetails);
  }

  onChangeIE(details: any) {
    this.chooseCommitte = '';
    this.chooseLobbiest = '';
    this.chooseIE = details.contactId?details.contactId:details.contactId;
    this.filerType = 'ie';
    details.entityType = 'AC-IEF';
    this.getCommitteeLobbyDetail(details.contactId?details.contactId:details.contactId, details.entityType,this.urlService.getUserEntitiesDetails);
  }

  viewOther() {
    this.showAllFilter = true;
  }

  checkAnyTwoExist() {
    if ((this.committeeLobbyList. committees.length > 0 || this.committeeLobbyList. lobbyists.length > 0 || this.committeeLobbyList. independentExp.length > 0)) {
      if ((this.committeeLobbyList. committees.length && this.committeeLobbyList. independentExp.length) || (this.committeeLobbyList. committees.length && this.committeeLobbyList. lobbyists.length) || (this.committeeLobbyList. independentExp.length && this.committeeLobbyList. lobbyists.length)) {
        return true;
      }
    }
    return false;
  }

  // New /Join Event
  switchJoinNewEvent(event: any) {
    this.Sendback();
    console.log(event);
    let { type, id } = event;
    if (type == 'new') {
      switch (id) {
        case 1:
          this.router.navigate(['/committee/committee-registration']);
          break;
        case 2:
          // this.router.navigate(['/lobbyist/createlobbyist']);
          this.showNewIndipendent = true;
          break;
        case 3:
          this.router.navigate(['/lobbyist/createlobbyist']);
          break;
        default:
          break;
      }
    } else {
      switch (id) {
        case 1:
          this.showJoinCommittee = true;
          break;
        case 2:
          this.showJoinIndipendent = true;
          break;
        case 3:
          this.showJoinLobby = true;
          break;
        default:
          break;
      }
    }
  }


  deleteSelectedList(e: any) {
    //TODO remove selected lobby/Committee from list
    console.log("need to do remove selected lobby/Committee from list", e.data);
    this.selectedCommLobbList.splice(e.idx, 1);
  }

  addSelectedtoList(data: any) {
    this.listData = data;
    //TODO add selected lobby/Committee to list
    console.log("need to do add selected lobby/Committee from list", data);
    if (this.selectedCommLobbList.length < 10) {
      let findLockerProduct
      if (this.showJoinCommittee) {
        findLockerProduct = this.selectedCommLobbList.find(
          (o: any) => o.committeeId == data.committeeId
        );
      } else if (this.showJoinLobby) {
        findLockerProduct = this.selectedCommLobbList.find(
          (o: any) => o.contactId == data.contactId
        );


      } else if (this.showJoinIndipendent) {
        findLockerProduct = this.selectedCommLobbList.find(
          //Need to change
          (o: any) => o.contactId == data.contactId
        );
      }
      if (findLockerProduct) {
        return this.snackbar.snackbarError(
          "Already Selected",
          this.masterDate.centre
        );
      } else {
        this.selectedCommLobbList.push(data);
        this.hideNext = false;
        // this.getCommitteeList = [];
        // this.getLobbyList = [];
        // this.getIndipendentList = [];
      }
    } else {
      this.snackbar.snackbarError(
        "Maximum Limit Reached",
        this.masterDate.centre
      );
    }

  }

  addSearchEmitter(e: any) {
    this.selectCommittee = e;
    if (this.showJoinCommittee) {
      this.getCommittee();
    } else if (this.showJoinLobby) {
      this.getLobby();
    } else if (this.showJoinIndipendent) {
      this.getIndipendent();
    }
  }

  getCommittee() {
    const id = {
      searchCommitteeName: this.selectCommittee ? this.selectCommittee : "",
    };
    let searchCommitteeName= this.selectCommittee ? this.selectCommittee : "%";
    this.service
      .getData(this.urlService.getCommiteesListNew+'?searchCommittee='+searchCommitteeName+'&committeetype=All')
      .subscribe((res: any) => {
        this.getCommitteeList = res;
        console.log(res)
      });
  }
  getLobby() {
    const id = {
      searchLobbyName: this.selectCommittee ? this.selectCommittee : "",
    };
    this.service.getData(this.urlService.lobbyList).subscribe((res: any) => {
      this.getLobbyList = res;
      console.log(this.getLobbyList);
    });
  }

  getIndipendent() {
    const id = {
      IndependentSpender: this.selectCommittee ? this.selectCommittee : "",
    };
    // Need to change URL
    this.service.getData(`${this.urlService.indipendentList}?independentSpenderId=0`).subscribe((res: any) => {
      this.getIndipendentList = res;
      console.log(this.getIndipendentList);
    });
  }
  navigate(data: any) {

  }

  SendDetail(selectedJoin: any) {
    let type = "Committee";
    if (selectedJoin == 3) {
      type = "Lobbyist";
    } else if (selectedJoin == 2) {
      type = "Independent Expenditure"
    }
    if (this.selectedCommLobbList.length == 0 || !this.note) {


      return this.snackbar.snackbarError(`please select ${type} and add Note to it`, this.masterDate.centre)
    }
    let sendObj: any = {
      contactID: 0,
      notes: this.note
    }
    let url = '';
    if (selectedJoin == 1) {
      url = this.urlService.addCommitteeAffiliation;
      //Join Committee
      sendObj.committeeids = this.selectedCommLobbList.map((sel: any) => {
        return {
          committeeID: sel.committeeId
        }
      })
    } else if (selectedJoin == 2) {
      url = this.urlService.sendIE;
      //Join Lobbyist
      sendObj.independentSpenderIds = this.selectedCommLobbList.map((sel: any) => {
        return {
          independentSpenderID: sel.contactId
        }
      })
    } else if (selectedJoin == 3) {
      //Join IE
      url = this.urlService.addLobbyistAffiliation;
      sendObj.lobbyistids = this.selectedCommLobbList.map((sel: any) => {
        return {
          lobbyistID: sel.lobbyistID
        }
      })
    }

    this.sendDetailService(url, sendObj, type);
  }

  sendDetailService(url, payload, type) {
    this.type = type;
    this.service.postData(url, payload).subscribe((res: any) => {
      // this.snackbar.snackbarSuccess(`${type}'s are sent for approval`);
      // let message =`Your request for access has been sent to the ${type}`;
      // let notify = `You will be Notified at ${this.email} when your access is Approved.`;
      // this.showScuccess = true;
      this.message =`Your request for access has been sent to the ${type}`;
      this.notify = `You will be notified at ${this.email} when your access is Approved.`;
    this.showScuccess = true;
    this.Sendback();

      // this.Sendback();
    });
    this.type = type;
    // this.message =`Your request for access has been sent to the ${type}`;
    //   this.notify = `You will be notified at ${this.email} when your access is Approved.`;
    // this.showScuccess = true;
    // this.Sendback();
  }

  SendNewIEDetail() {
    // let  {"userID":505,"userTypeId":"USER-IEF","filerType":"FT-ORG","occupation":"","employer":"ewrer"}
  }

  sendBackToDashboard() {
    if (!this.canDeactivate()) {
      return this.openDialog();
    }
    this.navigatePage();
  }

  navigatePage() {
    switch (this.showWhichComm) {
      case "committee":
        this.router.navigate([this.masterDate.dashboard]);
        break;
      case "ie":
        this.router.navigate([this.masterDate.dashboard]);

        break;
      case "Lobbyist":
        this.router.navigate([this.masterDate.lobbyDashboard]);
        break;
      default:
        this.router.navigate([this.masterDate.dashboard]);
        break;
    }
  }


  // After Join success message
  SendtoDashboard() {
    // if(!this.canDeactivate()){
    //   return this.openDialog();
    // }
    this.showScuccess = false;
    this.getCommitteeLobbyList();
    return this.Sendback();
  }

  Sendback() {
    this.showJoinCommittee = false;
    this.showJoinIndipendent = false;
    this.showJoinLobby = false;
    this.showNewIndipendent = false;
    this.selectedCommLobbList = [];
    this.note = '';
  }

  IEFormData(event: any) {
    //Need to Do
    console.log(event);
    let { filerType, occupation, employer, userTypeId = 'USER-IEF',organisation:organisationName = '' } = event;
    this.service.postData(this.urlService.saveIE, {contactId:0, filerType, occupation, employer, organisationName }).subscribe((res: any) => {
      this.snackbar.snackbarSuccess(`New Independent Expenditure are sent for approval`);
      this.Sendback();
    });

  }

  selectFiler() {
    const fromlogin = this.localStore.setLocalStorage('fromlogin', false);
    //Need to Do
    this.localStore.setLocalStorage('user_type', this.committeeLobbyList.userType);
    if (this.chooseCommitte) {
      this.localStore.setLocalStorage('choosen_id', this.chooseCommitte);
      this.localStore.setLocalStorage('user_chosen', 'committee');
      this.router.navigate([this.masterDate.dashboard]);
    } else if (this.chooseLobbiest) {
      this.localStore.setLocalStorage('choosen_id', this.chooseLobbiest);
      this.localStore.setLocalStorage('user_chosen', 'Lobbyist');
      this.router.navigate([this.masterDate.lobbyDashboard]);
    } else if (this.chooseIE) {
      this.localStore.setLocalStorage('choosen_id', this.chooseIE);
      this.localStore.setLocalStorage('user_chosen', 'ie');
      this.router.navigate([this.masterDate.dashboard]);
    }
  }

}
