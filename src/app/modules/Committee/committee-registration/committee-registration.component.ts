import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { Subject } from 'rxjs';
import { TransferDataService } from 'src/app/core/services/data-service';
@Component({
  selector: 'app-committee-registration',
  templateUrl: './committee-registration.component.html',
  styleUrls: ['./committee-registration.component.scss']
})
export class CommitteeRegistrationComponent implements OnInit {
  @Output() emitUsertype = new EventEmitter<Object>();
  static_data: any;
  showTab: boolean = true;
  selectIndex: any = 0;
  infoForm: any;
  contactInfoForm: any;
  contactId: any = 0;
  committeeRegistrationDate = {

    // "committeeInfo": {
    //   "tenantId": 1,
    //   "createdBy": "Denver",
    //   "createdAt": "2021-02-25T05:14:59.744Z",
    //   "updatedBy": "Denver",
    //   "updatedOn": "2021-02-25T05:14:59.744Z",
    //   "committeeId": 1,
    //   "committeeName": "Game Rider",
    //   "committeType": "CAN",
    //   "candidateName": "Sample User",
    //   "officerType": "OFF-CAN",
    //   "district": "Salem",
    //   "electionDateRefId": 1,
    //   "ballotIssueNo": "BI1",
    //   "ballotIssueNote": "Testing Sample",
    //   "position": "OP",
    //   "purpose": "Oppose",
    //   "address1": "#1343, NEw Street",
    //   "address2": "5th Street",
    //   "city": "Salem",
    //   "stateCode": "TN",
    //   "zipcode": 12345,
    //   "campaignPhone": "3334334",
    //   "campaignEmail": "sss@ss.com",
    //   "otherPhone": "343334534",
    //   "otherEmail": "sdsd@sdf.com",
    //   "campaignWebsite": "www.sdfds.com",
    //   "bankName": "HDFC BAnk",
    //   "bankAddress1": "Chennai",
    //   "bankAddress2": "Chennai",
    //   "bankCity": "Chennai",
    //   "bankStateCode": "TN",
    //   "bankZipcode": 1232,
    //   "officerInfo": [
    //     {
    //       "tenantId": 1,
    //       "createdBy": "Denver",
    //       "createdAt": "2021-02-25T05:14:59.744Z",
    //       "updatedBy": "Denver",
    //       "updatedOn": "2021-02-25T05:14:59.744Z",
    //       "userId": 1,
    //       "title": "Mr",
    //       "firstName": "Natraj",
    //       "lastName": "M",
    //       "address1": "1/23, East Road",
    //       "address2": "Tambaram",
    //       "city": "Chennai",
    //       "stateCode": "TN",
    //       "zipcode": "12345",
    //       "countryCode": "IN",
    //       "email": "zcscz@asdas.com",
    //       "phone": "12332",
    //       "notifyEmailSentOn": "2021-02-25T05:14:59.744Z",
    //       "notifyAcceptedOn": "2021-02-25T05:14:59.744Z",
    //       "isNotifyAccepted": true,
    //       "userName": "test123",
    //       "userPassword": "12346",
    //       "salt": "12345",
    //       "organisationName": "Software Pvt",
    //       "businessName": "Development",
    //       "occupation": "Developer",
    //       "voterId": "SDFSFFED#sdfsd",
    //       "remarks": "sadas asdsadsadsad",
    //       "officerType": "OFF-CAN",
    //       "description": "Testing"
    //     }
    //   ]
    // }

    "committeeInfo": {
      "committeTypeId": "",
      "tenantId": 0,
      "committeeId": 0,
      "committeeName": "",
      "committeType": "",
      "candidateFirstName": "",
      "candidateLastName": "",
      "candidateName": "",
      "officerType": "",
      "district": "",
      "electionDateRefId": 0,
      "ballotIssueNo": "",
      "ballotIssueNote": "",
      "position": "",
      "purpose": "",
      "address1": "",
      "address2": "",
      "city": "",
      "stateCode": "",
      "zipcode": 0,
      "campaignPhone": "",
      "campaignEmail": "",
      "otherPhone": "",
      "otherEmail": "",
      "campaignWebsite": "",
      "bankName": "",
      "bankAddress1": "",
      "bankAddress2": "",
      "bankCity": "",
      "bankStateCode": "",
      "bankZipcode": 0,
      // "userID": 0,
      "officerInfo": [
      ]
    }
  }
  // userId: any = 0;
  userNext: any;
  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    public router: Router,
    public route: ActivatedRoute,
    private service: ClientService,
    private urlService: MasterUrlService,
    public snackbar: SnackbarService,
    private localStore: LocalstorageService,
    private dataTransfer: TransferDataService,
  ) {
    // if(this.commonMethods.getIsReloaded() == 'false'){
    //   window.location.reload();
    //   this.commonMethods.isReloaded('true')
    //   return;
    // }
    // this.commonMethods.isReloaded('false')
  }

  ngOnInit(): void {

    this.route?.queryParams.subscribe((params: any) => {
      this.contactId = +params['contactId']; // (+) converts string 'id' to a number

    });
    // if (!this.userId) {
    //   this.userId = this.localStore.getLocalStorage(this.masterDate.userId);
    // }

    // this.userId = parseInt(this.userId);
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();

  }
  isSelected(index: number) {
    if (this.selectIndex == index) {
      return false;
    } else {
      return true;
    }
  }
  CommitteeInfo(dataform: any) {
    let {
      committeeName,
      committeeType,
      ballotIssue,
      ballotIssueNo,
      electionDate,
      position,
      office_sought,
      district,
      candidateFirstName,
      candidateLastName,
      purpose,
      committeTypeId
    } = dataform.committee

    this.committeeRegistrationDate.committeeInfo.committeeName = committeeName;
    this.committeeRegistrationDate.committeeInfo.committeType = committeeType;
    this.committeeRegistrationDate.committeeInfo.ballotIssueNote = ballotIssue || '';
    this.committeeRegistrationDate.committeeInfo.ballotIssueNo = ballotIssueNo || '';
    this.committeeRegistrationDate.committeeInfo.electionDateRefId = electionDate || '';
      this.committeeRegistrationDate.committeeInfo.position = position || '';
    this.committeeRegistrationDate.committeeInfo.purpose = purpose || '';
    this.committeeRegistrationDate.committeeInfo.candidateFirstName = candidateFirstName;
    this.committeeRegistrationDate.committeeInfo.candidateLastName = candidateLastName;
    this.committeeRegistrationDate.committeeInfo.officerType = office_sought ? office_sought.toString() : "";
    this.committeeRegistrationDate.committeeInfo.district = district;
    this.committeeRegistrationDate.committeeInfo.committeTypeId = committeTypeId.toString() || '';
    //this.committeeRegistrationDate.committeeInfo = dataform;
    this.selectIndex += 1;
    this.userNext = dataform.userType
  }
  contactInformation(contactForm: any) {
    let {
      address1,
      address2,
      city,
      campPhone,
      state,
      zipCode,
      campEmail,
      altPhone,
      altEmail,
      commWebsite
    } = contactForm

    this.committeeRegistrationDate.committeeInfo.address1 = address1;
    this.committeeRegistrationDate.committeeInfo.address2 = address2;
    this.committeeRegistrationDate.committeeInfo.city = city;
    this.committeeRegistrationDate.committeeInfo.campaignPhone = campPhone;
    this.committeeRegistrationDate.committeeInfo.stateCode = state;
    this.committeeRegistrationDate.committeeInfo.zipcode = parseInt(zipCode);
    this.committeeRegistrationDate.committeeInfo.campaignEmail = campEmail;
    this.committeeRegistrationDate.committeeInfo.otherPhone = altPhone || '';
    this.committeeRegistrationDate.committeeInfo.otherEmail = altEmail || '';
    this.committeeRegistrationDate.committeeInfo.campaignWebsite = commWebsite;
    //this.committeeRegistrationDate.committeeInfo=contactForm;

    // this.selectIndex +=1;
    this.committeeContactDataSubmit();
  }

  committeeContactDataSubmit() {
    let committeeContactDatadetail: any = {
      "contactID": this.contactId || 0,
      // "candidateContactDetail": {
      //   "firstName": this.committeeRegistrationDate.committeeInfo.candidateFirstName || '',
      //   "lastName": this.committeeRegistrationDate.committeeInfo.candidateLastName || ''
      // },
      "committeeContactDetail": {
        "organizationName": "",
        "address1": this.committeeRegistrationDate.committeeInfo.address1 || '',
        "address2": this.committeeRegistrationDate.committeeInfo.address2 || '',
        "city": this.committeeRegistrationDate.committeeInfo.city || '',
        "stateCode": this.committeeRegistrationDate.committeeInfo.stateCode,
        "zip": this.committeeRegistrationDate.committeeInfo.zipcode ? this.committeeRegistrationDate.committeeInfo.zipcode.toString() : ''
      },
      "committeeOtherContactDetail": {
        "phone": this.committeeRegistrationDate.committeeInfo.campaignPhone || '',
        "email": this.committeeRegistrationDate.committeeInfo.campaignEmail || '',
        "altPhone": this.committeeRegistrationDate.committeeInfo.otherPhone || '',
        "altEmail": this.committeeRegistrationDate.committeeInfo.otherEmail || '',
      }
    };
    if (!this.committeeRegistrationDate.committeeInfo.committeTypeId) {
      return this.snackbar.snackbarError("Committee Type is invalid", this.masterDate.centre);
    }

    let url = this.urlService.committeeContactCreate;
    if (this.committeeRegistrationDate.committeeInfo.committeTypeId == 'COM-CAN') {
      //Candidate committee
      url = this.urlService.committeeContactCreate;
      committeeContactDatadetail.committeeDetail = {
        "committeeID": this.committeeRegistrationDate.committeeInfo.committeeId || 0,
        "committeeName": this.committeeRegistrationDate.committeeInfo.committeeName,
        "committeeTypeID": this.committeeRegistrationDate.committeeInfo.committeTypeId.toString() || '',
        "officeSoughtID": this.committeeRegistrationDate.committeeInfo.officerType ? this.committeeRegistrationDate.committeeInfo.officerType : '',
        "district": this.committeeRegistrationDate.committeeInfo.district || '',
        "electionCycleID": this.committeeRegistrationDate.committeeInfo.electionDateRefId || 0,
        "committeeWebsite": this.committeeRegistrationDate.committeeInfo.campaignWebsite || '',
        "bankName": "",
        "address1": this.committeeRegistrationDate.committeeInfo.address1 || '',
        "address2": this.committeeRegistrationDate.committeeInfo.address2 || '',
        "city": this.committeeRegistrationDate.committeeInfo.city || '',
        "stateCode": this.committeeRegistrationDate.committeeInfo.stateCode,
        "zip": this.committeeRegistrationDate.committeeInfo.zipcode ? this.committeeRegistrationDate.committeeInfo.zipcode.toString() : ''
      }
      committeeContactDatadetail.candidateContactDetail = {
        "firstName": this.committeeRegistrationDate.committeeInfo.candidateFirstName || '',
        "lastName": this.committeeRegistrationDate.committeeInfo.candidateLastName || ''
      }
    } else if (this.committeeRegistrationDate.committeeInfo.committeTypeId == 'COM-SDC') {
      // small Donor Committee
      url = this.urlService.createSmallDonorCommittee;
      committeeContactDatadetail.smallDonorCommitteeDetail = {
        "committeeID": this.committeeRegistrationDate.committeeInfo.committeeId || 0,
        "committeeTypeID": this.committeeRegistrationDate.committeeInfo.committeTypeId.toString() || '',
        "purpose": this.committeeRegistrationDate.committeeInfo.purpose || '',
        "committeeName": this.committeeRegistrationDate.committeeInfo.committeeName,
      }
    }

    else if (this.committeeRegistrationDate.committeeInfo.committeTypeId == 'COM-PAC') {
      // PAC Committee
      url = this.urlService.createPACCommittee;
      committeeContactDatadetail.pacCommitteeDetail = {
        "committeeID": this.committeeRegistrationDate.committeeInfo.committeeId || 0,
        "committeeTypeID": this.committeeRegistrationDate.committeeInfo.committeTypeId.toString() || 0,
        "purpose": this.committeeRegistrationDate.committeeInfo.purpose || '',
        "committeeName": this.committeeRegistrationDate.committeeInfo.committeeName,
      }
    }
    else if (this.committeeRegistrationDate.committeeInfo.committeTypeId == 'COM-IC') {
      // Issue Committee
      url = this.urlService.createIssueCommittee;
      committeeContactDatadetail.issueCommitteeDetail = {
        "committeeID": this.committeeRegistrationDate.committeeInfo.committeeId || 0,
        "committeeName": this.committeeRegistrationDate.committeeInfo.committeeName,
        "committeeTypeID": this.committeeRegistrationDate.committeeInfo.committeTypeId.toString() || '',
        "ballotIssueID": parseInt(this.committeeRegistrationDate.committeeInfo.ballotIssueNote) || 0,
        "electionCycleID": this.committeeRegistrationDate.committeeInfo.electionDateRefId,
        "position": this.committeeRegistrationDate.committeeInfo.position || '',
        "purpose": this.committeeRegistrationDate.committeeInfo.purpose || ''
      }
    }

    this.service.postData(url, committeeContactDatadetail).subscribe((res: any) => {
      // this.snackbar.snackbarSuccess("Committee Contact Information Updated Succesfully");
      // this.showTab = false;
      this.committeeRegistrationDate.committeeInfo.committeeId = res[0].pkId;
      this.selectIndex += 1;
    }, err => {
      this.snackbar.snackbarError("Issue while Save Committee", this.masterDate.centre);
    })
  }
  back() {
    if (!this.showTab) {
      this.showTab = true
      this.selectIndex = 3;
    }
    if (this.selectIndex == 0) {
      this.router.navigate(['/login'])
    }
    this.selectIndex -= 1
  }

  getOfficerDataList(data: any) {
    console.log(data)
    // setting Officer Data

    // let list =data.map((dat:any)=>{
    //   let { firstName, phone, lastName, email, address1, address2, city, state, zipcode, description, officerType } = dat;
    //   return  {
    //     "tenantId": 0,
    //       "userId": this.userId || 0,
    //       firstName,
    //       lastName,
    //       address1 ,
    //       address2 ,
    //       city ,
    //       stateCode:state ,
    //       zipcode:zipcode.toString(),
    //       countryCode:"" ,
    //       email ,
    //       phone ,
    //       officerType ,
    //       description
    //     }
    // })
    // console.log(list)
    // this.committeeRegistrationDate.committeeInfo.officerInfo = list;
    this.selectIndex += 1;
  }

  updatebankSubmitCommittee(bank_data: any) {
    let { bankName,
      address2,
      address1,
      city,
      state,
      zipcode } = bank_data;

    this.committeeRegistrationDate.committeeInfo.bankName = bankName || '';
    this.committeeRegistrationDate.committeeInfo.bankAddress1 = address1 || '';
    this.committeeRegistrationDate.committeeInfo.bankAddress2 = address2 || '';
    this.committeeRegistrationDate.committeeInfo.bankCity = city || '';
    this.committeeRegistrationDate.committeeInfo.bankStateCode = state || '';
    this.committeeRegistrationDate.committeeInfo.bankZipcode = zipcode || '';

    let data = {
      "committeeID": this.committeeRegistrationDate.committeeInfo.committeeId || 0,
      "bankName": this.committeeRegistrationDate.committeeInfo.bankName,
      "address1": this.committeeRegistrationDate.committeeInfo.bankAddress1 || '',
      "address2": this.committeeRegistrationDate.committeeInfo.bankAddress2 || '',
      "city": this.committeeRegistrationDate.committeeInfo.bankCity || '',
      "stateCode": this.committeeRegistrationDate.committeeInfo.bankStateCode || '',
      "zip": this.committeeRegistrationDate.committeeInfo.bankZipcode
    }
    // this.committeeRegistrationDate.committeeInfo.userID = parseInt(this.userId);
    this.committeeDataSubmit();
  }

  committeeDataSubmit() {
    let data = {
      "committeeID": this.committeeRegistrationDate.committeeInfo.committeeId || 0,
      "bankName": this.committeeRegistrationDate.committeeInfo.bankName,
      "address1": this.committeeRegistrationDate.committeeInfo.bankAddress1 || '',
      "address2": this.committeeRegistrationDate.committeeInfo.bankAddress2 || '',
      "city": this.committeeRegistrationDate.committeeInfo.bankCity || '',
      "stateCode": this.committeeRegistrationDate.committeeInfo.bankStateCode || '',
      "zip": this.committeeRegistrationDate.committeeInfo.bankZipcode
    }
    this.service.postData(this.urlService.updateBankInfo, data).subscribe((res: any) => {
      this.snackbar.snackbarSuccess("Committee Information Updated Succesfully");
      this.showTab = false;
      this.localStore.removeStorage(['contactId'])
    }, err => {
      this.snackbar.snackbarError("Issue while Save Committee", this.masterDate.centre);
    })
  }

  goback(tabId: any) {
    if (tabId == 1) {
      // this.emitUsertype.emit(this.userNext)
      this.selectIndex = this.selectIndex - 1;
      this.dataTransfer.changeData(this.userNext)
    } else {
      this.selectIndex = this.selectIndex - 1;
    }
  }

}
