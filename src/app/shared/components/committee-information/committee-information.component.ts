import { HostListener, Input, OnChanges } from '@angular/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonMethods, ErrorMessageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { Location } from "@angular/common";
import { Subject, Subscription } from 'rxjs';
import { DataService, TransferDataService } from 'src/app/core/services/data-service';


@Component({
  selector: 'app-committee-information',
  templateUrl: './committee-information.component.html',
  styleUrls: ['./committee-information.component.scss']
})
export class CommitteeInformationComponent implements OnInit {
  hideRequiredMarker: boolean = true;
  @Input() committeeInformation: any = { committeeInfo: {} };
  @Output() InformationFormValue = new EventEmitter<Object>();
  committeeInformationForm: any;
  static_data: any = {};
  committeeInfoForm: any;
  typeCommittee: any = [];
  ballotIssue: any = [];
  electionDate: any = [];
  position: any = [];
  userType: any;
  getAllOfficeListApi: any;
  otherCommittee: boolean = false;
  canUser: any;
  getBallotIssueList: any;
  chageType: any;
  subscribe: Subscription;
  committeList: any;
  userId: any;
  nextDisabled = false;
  ballotIssueCode: any;
  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    private urlService: MasterUrlService,
    public errorService: ErrorMessageService,
    private service: ClientService,
    public router: Router,
    public route: ActivatedRoute,
    private location: Location,
    private snackbar: SnackbarService,
    private dataSerice: DataService,
    private dataTransfer: TransferDataService,
  ) { }

  @HostListener('click', ['$event'])
  clickEvent(event) {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.disabled = true;
  }

  ngOnInit(): void {
    this.subscribe = this.dataTransfer.openModal.subscribe(data => {
      this.chageType = data
    });
    if (this.chageType) {
      this.validateUserType()
    } else {
      this.getUserDetailQueryparams();
    }
    this.getAllOfficeList();
    // this.getCommitteeList();
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    // this.InformationForm();
    this.getCommitteeType();
    this.getBallotIssue();
    this.getBallotList();
    this.getPosition();
    this.InformationForm(this.committeeInformation.committeeInfo)
  }
  validateUserType() {
    if (this.chageType == "COM-IC") {
      this.userType = 'AC-TSR'
      this.otherCommittee = false;
    } else if (this.chageType == "COM-CAN") {
      this.userType = 'AC-CAN'
      this.otherCommittee = false;
    } else {
      this.otherCommittee = true;
      this.userType = ''
    }
  }
  ngOnDestroy() {
    if (this.chageType) {
      this.subscribe.unsubscribe();
    }
  }
  getUserDetailQueryparams() {
    this.route?.queryParams.subscribe((params: any) => {
      this.userType = params['userType'];
      this.canUser = params['userType'];
      this.userId = params['userId'];
    });
  }
  changevalue(e) {
    this.chageType = e.lookUpTypeId
    if (e.lookUpTypeId == "COM-IC") {
      this.userType = 'AC-TSR'
      this.otherCommittee = false;
    } else if (e.lookUpTypeId == "COM-CAN") {
      this.userType = 'AC-CAN'
      this.otherCommittee = false;
    } else {
      this.otherCommittee = true;
      this.userType = ''
    }
  }
  getCommitteType(typeCommittee: any) {
    if (this.userType == 'AC-CAN') {
      return 'COM-CAN';
    } else if (this.userType == 'AC-TSR') {
      return 'COM-IC';
    }
    return typeCommittee;
  }

  checkForUserTypeTSR() {
    return (this.userType == 'AC-TSR')
  }

  checkForUserTypeCAN() {
    return (this.userType == 'AC-CAN')
  }
  getAllOfficeList() {
    this.service
      .getData(this.urlService.getallOfficeList)
      .subscribe((res: any) => {
        this.getAllOfficeListApi = res;
      });
  }
  InformationForm(committeeInfo: any) {
  //   if(committeeInfo.ballotIssueNote){
  //   for(let code of this.getBallotIssueList){
  //     if (code.ballotId == committeeInfo.ballotIssueNote){
  //       this.committeeInformationForm.patchValue({
  //         ballotIssueNo: code.ballotIssueCode
  //       });
  //     }
  //   }
  // }
    this.committeeInformationForm = new FormGroup({
      // committeeId: new FormControl(committeeInfo.committeeId || null),
      committeeName: new FormControl(committeeInfo.committeeName || null,),
      committeeType: new FormControl(this.getCommitteType(committeeInfo.committeType) || null, [Validators.required]),
      ballotIssue: new FormControl(committeeInfo.ballotIssueNote || null),
      ballotIssueNo: new FormControl(committeeInfo.ballotIssueNote || null),
      electionDate: new FormControl(committeeInfo.electionDateRefId || null),
      candidateFirstName: new FormControl(committeeInfo.candidateFirstName || null),
      candidateLastName: new FormControl(committeeInfo.candidateLastName || null),
      office_sought: new FormControl(committeeInfo.officerType || null),
      district: new FormControl(committeeInfo.district || null,
      ),
      position: new FormControl(committeeInfo.position || null),
      purpose: new FormControl(committeeInfo.purpose || null),
    });
    this.committeeInformationForm.controls['ballotIssueNo'].disable()
  }

  getCommitteeType() {
    // this.service.postData(this.urlService.GetLookUpTypeList,{"lookUpTypeCode": "COM"}).subscribe((res) => {
    this.service.getData(`${this.urlService.getLookUps}COM`).subscribe((res) => {
      this.typeCommittee = res;
      console.log(this.typeCommittee)

    })
  }
  // getCommitteeList(){
  //   this.service.getData(this.urlService.getCommitteeList).subscribe((res) => {
  //     this.committeList = res
  //     console.log(res);
  //   })
  // }
  getBallotIssue() {
    this.service.getData(this.urlService.getElectionData).subscribe((res) => {
      this.electionDate = res;
      // for (let index = 0; index < res.length; index++) {
      //   let { electionDate, sequenceNo = 1, id = 0 } = res[index];
      //   // this.ballotIssue.push({ballotIssue, ballotIssueCode});
      //   this.electionDate.push({ electionDate, sequenceNo, electionDateRefId: id });
      // }
      //   console.log(this.ballotIssue);
    });
  }
  changeOffice(o){
    if(o.typeId == "OFF-CLL"){
      this.committeeInformationForm.controls["district"].setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(300)])
      this.committeeInformationForm.controls['district'].updateValueAndValidity()
    }else{
      this.committeeInformationForm.controls['district'].clearValidators()
      this.committeeInformationForm.controls['district'].updateValueAndValidity()
    }
  }
  onChangeType(e) {
    this.ballotIssueCode = e.value
    for(let code of this.getBallotIssueList){
      if (code.ballotId == this.committeeInformationForm.value.ballotIssue){
        this.committeeInformationForm.patchValue({
          ballotIssueNo: code.ballotIssueCode
        });
      }
    }
  }
  getBallotList() {
    this.service.getData(this.urlService.getBallot).subscribe((res) => {
      this.getBallotIssueList = res;
      console.log(this.ballotIssue);
    })
  }
  // getBallotIssue() {
  //   this.service.getData(this.urlService.getBallot).subscribe((res: any) => {
  //     this.getBallotIssueList = res;
  //     this.dataBallotList.data = [...this.getBallotIssueList];
  //   });
  // }
  getPosition() {
    // this.service.postData(this.urlService.lookupGetList,{"lookUpType": "POSITION"}).subscribe((res: any) => {
    this.service.getData(`${this.urlService.getLookUps}POSITION`).subscribe((res: any) => {
      for (let index = 0; index < res.length; index++) {
        this.position.push(res[index].lookUpName);

      }
      console.log(this.position);
    })
  }


  validateSubmitContactInfo() {
    // this.InformationFormValue.emit(this.committeeInfoForm.value);
    this.nextDisabled = true;
    try {
    if (this.userType == "AC-CAN") {
      this.committeeInformationForm.controls['committeeName'].setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
        this.committeeInformationForm.controls['committeeType'].setValidators([Validators.required]),
        this.committeeInformationForm.controls['candidateFirstName'].setValidators([Validators.required]),
        this.committeeInformationForm.controls['candidateLastName'].setValidators([Validators.required]),
        this.committeeInformationForm.controls['office_sought'].setValidators([Validators.required]),
        this.committeeInformationForm.controls['electionDate'].setValidators([Validators.required]),
        this.committeeInformationForm.controls['committeeName'].updateValueAndValidity()
      this.committeeInformationForm.controls['committeeType'].updateValueAndValidity()
      this.committeeInformationForm.controls['candidateFirstName'].updateValueAndValidity()
      this.committeeInformationForm.controls['candidateLastName'].updateValueAndValidity()
      this.committeeInformationForm.controls['office_sought'].updateValueAndValidity()
      this.committeeInformationForm.controls['electionDate'].updateValueAndValidity()
      this.committeeInformationForm.controls['ballotIssue'].clearValidators()
      this.committeeInformationForm.controls['purpose'].clearValidators()
      this.committeeInformationForm.controls['position'].clearValidators()
    } else if (this.userType == "AC-TSR") {
      this.committeeInformationForm.controls['committeeName'].setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
        this.committeeInformationForm.controls['committeeType'].setValidators([Validators.required]),
        this.committeeInformationForm.controls['ballotIssue'].setValidators([Validators.required]),
        this.committeeInformationForm.controls['electionDate'].setValidators([Validators.required]),
        this.committeeInformationForm.controls['position'].setValidators([Validators.required]),
        this.committeeInformationForm.controls['purpose'].setValidators([Validators.required])
      this.committeeInformationForm.controls['committeeName'].updateValueAndValidity()
      this.committeeInformationForm.controls['committeeType'].updateValueAndValidity()
      this.committeeInformationForm.controls['ballotIssue'].updateValueAndValidity()
      this.committeeInformationForm.controls['electionDate'].updateValueAndValidity()
      this.committeeInformationForm.controls['purpose'].updateValueAndValidity()
      this.committeeInformationForm.controls['candidateFirstName'].clearValidators()
      this.committeeInformationForm.controls['candidateLastName'].clearValidators()
      this.committeeInformationForm.controls['office_sought'].clearValidators()
    } else {
      this.committeeInformationForm.controls["purpose"].setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(300)])
      this.committeeInformationForm.controls['purpose'].updateValueAndValidity()
      this.committeeInformationForm.controls['candidateFirstName'].clearValidators()
      this.committeeInformationForm.controls['candidateLastName'].clearValidators()
      this.committeeInformationForm.controls['office_sought'].clearValidators()
      this.committeeInformationForm.controls['ballotIssue'].clearValidators()
      this.committeeInformationForm.controls['position'].clearValidators()
      this.committeeInformationForm.controls['electionDate'].clearValidators()
      this.committeeInformationForm.controls['committeeName'].clearValidators()
      this.committeeInformationForm.controls['committeeType'].clearValidators()
    }
    if (this.committeeInformationForm.valid) {
      this.service.getData(`${this.urlService.getCommitteeListAll}?searchCommittee=${this.committeeInformationForm.value.committeeName}&committeetype=All`).subscribe((res) => {
        try{
        this.committeList = res;

        //   let findCommitteeName;
        //   findCommitteeName = this.committeList.find(
        //     (o: any) => o.committeeName == this.committeeInformationForm.value.committeeName
        //   );
        this.committeeInfoForm = this.committeeInformationForm.value;
        this.typeCommittee.map(re => {
          if (re.lookUpTypeId == this.committeeInfoForm.committeeType) {
            this.committeeInfoForm.committeTypeId = re.lookUpTypeId;
            this.committeeInfoForm.lookUpOrder = re.lookUpOrder;
          }
        })
        console.log(JSON.stringify(this.committeeInfoForm));
        // if (!findCommitteeName){
        if (!res.length) {
          this.InformationFormValue.emit({ committee: this.committeeInfoForm, userType: this.chageType });
        } else {
          // if (this.committeeInformation.committeeInfo.committeeId == res[0].committeeId) {
          //   return this.InformationFormValue.emit({ committee: this.committeeInfoForm, userType: this.chageType });
          // } 
          this.nextDisabled = false;
          return this.snackbar.snackbarError('Committee name already exists', 'center');
        }
      } catch(er){
          this.nextDisabled = false;
        }
        this.nextDisabled = false;
      })
    }
    else {
      this.committeeInformationForm.markAllAsTouched();
      this.nextDisabled = false;
    }
  }catch(err){
    this.nextDisabled = false;
  }
  }
  back() {
    this.router.navigate(["/createaccount"], {
      queryParams: {
        userId: this.userId,
        userType: this.userType,
      },
    });
    this.dataSerice.changeMessage("call create account");
  }
}
