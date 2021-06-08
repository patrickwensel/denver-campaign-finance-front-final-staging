import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService } from 'src/app/core';
import { SnackbarService } from './../../../core/snackbar/snackbar.service';
import { DeleteModalComponent } from './../../../shared/components/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from 'src/app/core/api-services/client.service';
import { debounceTime } from 'rxjs/operators';
import { Subscriber, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-committee-manage-office',
  templateUrl: './committee-manage-office.component.html',
  styleUrls: ['./committee-manage-office.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CommitteeManageOfficeComponent implements OnInit {
  hideRequiredMarker: boolean = true;
  static_data: any = {};
  addCommitteeOfficerForm: FormGroup;
  officeSearchList: any = [];//[{ id: 1, name: "Sample 1" }, { id: 2, name: "Sample 1 Large" }, { id: 3, name: "Sample 1 Extra Large" }]
  SearchControl = new FormControl();
  modal: any = {};
  FormEditId: any = 0;
  @Output() officerDataEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() backBtnEmiter = new EventEmitter<Object>();
  @Input() committeeInformation: any = { committeeInfo: {} };
  stateList: any = [];
  officerList: any = [];
  userType: any = '';
  userDetail: any = {};
  user_type: any = '';
  officeTypeDisabled= true;
  // {
  //   "userId": 1,
  //   "fName": "Prakash",
  //   "lName": "Raju",
  //   "address1": "3rd Street",
  //   "address2": "5th Main road",
  //   "cityName": "Salem",
  //   "stateCode": "TN",
  //   "zip": "666666",
  //   "phoneNo": "3434534534",
  //   "emailId": "prakash.raju@augustahitech.com"
  // };
  // searchAdvanceSub: Subscription;
  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    public snackbar: SnackbarService,
    public dialog: MatDialog,
    private service: ClientService,
    private urlService: MasterUrlService,
    public router: Router,
    public route: ActivatedRoute,
    private localStore: LocalstorageService,
  ) { }

  isTableExpanded = false;

  ngOnInit() {
    //   this.route.queryParams.subscribe((params:any) => {
    //     this.userType = +params['userType']; // (+) converts string 'id' to a number

    //  });
    // this.dataOfficerList.data = this.STUDENTS_DATA;
    this.getOfficerTableList();
    
    this.user_type = this.localStore.getLocalStorage(this.masterDate.user_Type);
    this.userDetail = this.localStore.getLocalStorage(this.masterDate.userDetail);
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.initCommitteeOfficerForm();
    this.getStateList();
    this.getOfficerTypeList();
    // this.getOfficerList();
    // this.setOfficerList(this.committeeInformation.committeeInfo);
    this.getOfficerListAPI();
    // this.setIntialArray();
    // this.committeeInformation.committeeInfo.committeType = 'COM-CAN';
  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  getOfficerTableList(){
    // this.committeeInformation.committeeInfo.committeeId = 18;
    this.service.getData(`${this.urlService.getOfficerTableList}${parseInt(this.committeeInformation.committeeInfo.committeeId)}`).subscribe((res: any) => {
      this.dataOfficerList.data = res;
    })
  }

  setIntialArray() {

    let comm_type = this.setOfficerbasedOnCommitteeType(this.committeeInformation.committeeInfo.committeType);
    let {
      userId,
      fName,
      lName,
      address1,
      address2,
      cityName,
      stateCode,
      zip,
      phoneNo,
      emailId
    } = this.userDetail;
    let data = [{
      id: this.dataOfficerList.data.length + 1,
      firstName: fName,
      lastName: lName,
      address1,
      address2,
      city: cityName,
      state: stateCode,
      zipcode: zip,
      phone: phoneNo,
      email: emailId,
      description: "",
      officerType: "Treasurer",
      isExpanded: false,
      isFromCommittee: true,
    }];
    if (comm_type == 'Candidate') {
      let { candidateFirstName, candidateLastName, address1, address2, city, stateCode, zipcode, campaignPhone, campaignEmail } = this.committeeInformation.committeeInfo
      data.push({
        id: this.dataOfficerList.data.length + 2,
        firstName: candidateFirstName,
        lastName: candidateLastName,
        address1,
        address2,
        city,
        state: stateCode,
        zipcode: zipcode,
        phone: campaignPhone,
        email: campaignEmail,
        description: "",
        officerType: comm_type,
        isExpanded: false,
        isFromCommittee: true,
      })
    }
    return data;
    // this.dataOfficerList.data = data;
  }

  setOfficerbasedOnCommitteeType(type: any) {
    let obt = {
      'COM-IC': 'Treasurer',
      'COM-PAC': 'Treasurer',
      'COM-SDC': 'Treasurer',
      'COM-CAN': 'Candidate'
    };
    return obt[type] ? obt[type] : 'Treasurer';
  }
  setOfficerList(committeeInfo: any) {

    let list: any;
    list = committeeInfo.officerInfo?.map((dat: any) => {
      let { userId, firstName, phone, lastName, email, address1, address2, city, stateCode, zipcode, description, officerType, isFromCommittee } = dat;
      return {
        "tenantId": 0,
        userId,
        firstName,
        lastName,
        address1,
        address2,
        city,
        state: stateCode,
        zipcode,
        countryCode: "",
        email,
        phone,
        officerType,
        description,
        isFromCommittee: isFromCommittee ? isFromCommittee : false,
      }
    })
    console.log(list)
    if (!committeeInfo.officerInfo.length || (this.committeeInformation.committeeInfo.committeType == 'COM-CAN' && ((committeeInfo.officerInfo.findIndex(r => (r.officerType == 'Treasurer')) == -1) || (committeeInfo.officerInfo.findIndex(r => (r.officerType == 'Candidate')) == -1))) || (committeeInfo.officerInfo.findIndex(r => (r.officerType == 'Candidate' || r.officerType == 'Treasurer')) == -1)) {
      if (this.committeeInformation.committeeInfo.committeType == 'COM-CAN') {
        if (committeeInfo.officerInfo.findIndex(r => (r.officerType == 'Treasurer')) == -1) {
          list.unshift(this.setIntialArray()[0]);
        }
        if (committeeInfo.officerInfo.findIndex(r => (r.officerType == 'Candidate')) == -1) {
          list.unshift(this.setIntialArray()[1]);
        }

      } else {
       
        list.unshift(this.setIntialArray()[0]);
      }
      
    }else{
      if (this.committeeInformation.committeeInfo.committeType != 'COM-CAN') {
      let k = list.findIndex(ra => ra.officerType == "Candidate");
      if(k != -1){
        list.splice(k,1);
      }
    }
  }
    this.dataOfficerList.data = list;
  }

  getOfficerListAPI(event: any = null) {
    let value = '';
    if (event) {
      value = event.target.value;
    }
    // let {
    //   userId,
    //   fName,
    //   lName,
    //   address1,
    //   address2,
    //   cityName,
    //   stateCode,
    //   zip,
    //   phoneNo,
    //   emailId
    // } = this.userDetail ;
    this.officeSearchList = [];
    this.service.getData(`${this.urlService.getOfficeSearchByName}${value}`).subscribe((res: any) => {
      // Hided for now it will integrated in future sprint(Transaction)
      // this.officeSearchList = res;
      // let data = [{
      //   id: userId,
      //   firstName: fName,
      //   lastName: lName,
      //   address1,
      //   address2,
      //   city:cityName,
      //   state:stateCode,
      //   zipcode: zip,
      //   phone: phoneNo,
      //   email: emailId,
      //   description: "",
      //   officerType: "",
      //   isExpanded: false,
      // }];

      this.officeSearchList = res;
    })
  }

  getStateList() {
    this.stateList = [];
    this.service.getData(this.urlService.getLookUpStateList).subscribe((res: any) => {
      this.stateList = res;
    })
  }

  getOfficerTypeList() {
    this.officerList = [];
    // this.service.getData(`${this.urlService.getLookUps}OFF`).subscribe((res: any) => {
    //   this.officerList = res;
    // })
    this.officerList = [
      {lookUpTypeId:'Officer',lookUpName:'Officer'},
      {lookUpTypeId:'Treasurer',lookUpName:'Treasurer'},
      {lookUpTypeId:'Candidate',lookUpName:'Candidate'},
    ]
  }

  getOfficerList(val: any = null) {
    this.officerList = [];
    this.service.postData(this.urlService.getOfficerTypeList, { "lookUpType": "OFF" }).subscribe((res: any) => {
      this.officeSearchList = res;
    })
  }
  // }

  initCommitteeOfficerForm(data: any = {}) {

    this.addCommitteeOfficerForm = new FormGroup({
      contactID: new FormControl(data.contactID || '',
        []),
      type: new FormControl(data.type || '',
        []),
      firstName: new FormControl(data.firstName || '',
        [Validators.minLength(1), Validators.maxLength(120), Validators.pattern(this.masterDate.onlyAlpha)]),
      lastName: new FormControl(data.lastName || null,
        [Validators.minLength(1), Validators.maxLength(120), Validators.pattern(this.masterDate.onlyAlpha)]),
      phone: new FormControl(data.phone || null,
        [Validators.maxLength(10), Validators.pattern(this.masterDate.phoneNumerhipenvalidation)]),
      email: new FormControl(data.email || null,
        [Validators.maxLength(120), Validators.pattern(this.masterDate.emailValidations)]),
      address1: new FormControl(data.address1 || null,
        [Validators.minLength(1), Validators.maxLength(150), Validators.pattern(this.masterDate.addressPattern)]),
      address2: new FormControl(data.address2 || null,
        [Validators.minLength(1), Validators.maxLength(150), Validators.pattern(this.masterDate.addressPattern)]),
      city: new FormControl(data.city || null,
        []),
      state: new FormControl(data.stateCode || null,
        []),
      zipcode: new FormControl(data.zip || null),
      description: new FormControl(data.description || null,
        []),
      officerType: new FormControl(data.officerType?data.officerType:data.roleName?data.roleName.trim():'Officer' || null,
        []),
    })

    // this.searchAdvanceSub = this.addCommitteeOfficerForm.get('SearchControl').valueChanges.pipe(debounceTime(500)).subscribe(val => {
    // this.searchAssociatedFacilities(val);
    // });
  }

  getOfficerType(offName){
    if(!offName) {
      return offName;
    }
    let name =offName;
    this.officerList.map(off => {
      if(off.lookUpName.trim() == offName.trim()){
        name = off.lookUpName;
      }
    });
    return name;
  }
  STUDENTS_DATA = [
    {
      id: 1,
      firstName: "dfdsf",
      lastName: "dfdsf",
      address1: "dfdsf",
      address2: "dfdsf",
      city: "dfdsf",
      state: "AP",
      zipcode: "12345",
      phone: "dfdsf",
      email: "dfdsf",
      description: "dfdsf",
      officerType: "dfdsf",
      isExpanded: false,
    },

  ];


  dataOfficerList = new MatTableDataSource();
  displayedStudentsColumnsList: string[] = ['toggle', 'firstName', 'lastName', 'officerType', 'description', 'edit'];

  goBack() {
    this.backBtnEmiter.emit(2)
  }

  searchOfficer(event: any) {
    this.getOfficerList(event.target.value + '')

  }

  // Toggel Rows
  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;

    this.dataOfficerList.data.forEach((row: any) => {
      row.isExpanded = this.isTableExpanded;
    })
  }

  selectedItem(data: any) {
    console.log(data);
    let { firstName, phone, lastName, email, address1, address2, city, stateCode, zipcode, description, officerType, contactID } = data;
    this.modal = {
      // firstName: firstName.trim(),
      // lastName: lastName.trim(),
      // address1,
      // address2,
      // city,
      // state: stateCode,
      // zipcode,
      // phone,
      // email,
      // description,
      // officerType,
      // // officerId,
      // // isExpanded: false,
      contactID:contactID || 0,
      firstName: firstName.trim(),
      moddleName: '',
      lastName: lastName.trim(),
      "organizationName": "",
      address1,
      address2,
      city,
      stateCode:state,
      countryCode:'',
      zip:zipcode,
      phone,
      email,
      description,
      officerType,
      isExpanded: false,
      committeeID:this.committeeInformation.committeeInfo.committeeId,
    };
    this.initCommitteeOfficerForm(this.modal);
  }

  // Next page event SubmittOfficers
  validateSubmitOfficer() {
    if (this.dataOfficerList.data.length < 1) {
      return this.snackbar.snackbarError("Minimum One Officer is required", this.masterDate.centre)
    }
    this.officerDataEmitter.emit(this.dataOfficerList.data);
  }

  // Save/Add Officerto List
  validateAddOfficer() {
    Object.keys(this.addCommitteeOfficerForm.controls).forEach(key => {
      if (this.addCommitteeOfficerForm.get(key)) {
        this.addCommitteeOfficerForm.get(key).updateValueAndValidity();
      }
    });
    if (this.addCommitteeOfficerForm.valid) {
      const data = this.dataOfficerList.data;
      let { firstName, phone, lastName, email, address1, address2, city, state, zipcode, description, officerType, contactID} = this.addCommitteeOfficerForm.value;
      if (this.checkEmailAlreadyExist(email)) {
        return this.snackbar.snackbarError("Officer Email already exist in the Current Officers list", this.masterDate.centre)
      }
      this.modal = {
        // id:data.length + 1,
        contactID:contactID || 0,
        firstName: firstName.trim(),
        moddleName: '',
        lastName: lastName.trim(),
        "organizationName": "",
        address1,
        address2,
        city,
        stateCode:state,
        countryCode:'',
        zip:zipcode,
        phone,
        email,
        description,
        officerType,
        isExpanded: false,
        committeeID:this.committeeInformation.committeeInfo.committeeId,
      };

      // {
      //   "contactID": 0,
      //   "firstName": "string",
      //   "moddleName": "string",
      //   "lastName": "string",
      //   "organizationName": "string",
      //   "address1": "string",
      //   "address2": "string",
      //   "city": "string",
      //   "stateCode": "string",
      //   "countryCode": "string",
      //   "zip": "string",
      //   "email": "string",
      //   "phone": "string",
      //   "occupation": "string",
      //   "voterID": "string",
      //   "description": "string",
      //   "committeeID": 0
      // }

      this.service.postData(this.urlService.saveOfficer, this.modal).subscribe((res: any) => {
        this.getOfficerTableList();
        // this.officeTypeDisabled = false;
        this.addCommitteeOfficerForm.patchValue({
          officerType:'Officer'
        });
        this.snackbar.snackbarSuccess("Officer added successfully")
        this.clearForm()
        console.log(this.dataOfficerList);
      })

      // if (!this.FormEditId) {

      //   this.modal.id = data.length + 1;

      // } else {
      //   // update
      //   let findI = data.findIndex((fd: any) => fd.id == this.FormEditId);
      //   if (findI != -1) {
      //     data.splice(findI, 1)
      //   }
      //   this.modal.id = this.FormEditId;
      //   this.FormEditId = 0;
      // }
      // data.push(this.modal);
      // this.dataOfficerList.data = data;
     
    }
    else {
      this.addCommitteeOfficerForm.markAllAsTouched();
    }
  }

  checkEmailAlreadyExist(email: string) {
    if (this.FormEditId) return false;

    let exist = this.dataOfficerList.data.findIndex((d: any) => d.email == email);
    return !(exist === -1);
  }

  // clear Form
  clearForm() {
    this.FormEditId = 0;
    this.addCommitteeOfficerForm.reset();

    Object.keys(this.addCommitteeOfficerForm.controls).forEach(key => {
      if (this.addCommitteeOfficerForm.get(key)) {
        this.addCommitteeOfficerForm.get(key).setErrors(null);
      }
    });
    // this.officeTypeDisabled = false;
    this.addCommitteeOfficerForm.patchValue({
      officerType:'Officer'
    });
  }

  editOfficerForm(data: any) {
    this.FormEditId = data.contactID;
    // this.officeTypeDisabled = true;
    this.initCommitteeOfficerForm(data)
  }

  openConfirmationModal(id: any): void {
    if (this.dataOfficerList.data.length <= 1) {
      return this.snackbar.snackbarError('Minimum one officer is required', this.masterDate.centre);
    }
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: "460px",
      // height: "350px",
      data: {
        id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== "close") {
        // const data = this.dataOfficerList.data;
        // let findI = data.findIndex((fd: any) => fd.id == result);
        // if (findI != -1) {
        //   data.splice(findI, 1)
        // }
        // this.dataOfficerList.data = data;
        this.service.delete(`${this.urlService.deleteOfficer}${id}`).subscribe((res: any) => {
          this.getOfficerTableList();
          return this.snackbar.snackbarError('Officer deleted successfully', 'center');
        })
      }
    });
  }

}
