import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { th, tr } from "date-fns/locale";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import {
  CommonMethods,
  ErrorMessageService,
  LocalstorageService,
  MasterDataService,
  MasterUrlService,
  SnackbarService,
} from "src/app/core";
import { ClientService } from "src/app/core/api-services/client.service";
import { ConfirmPopupComponent } from "src/app/shared/components/confirm-popup/confirm-popup.component";
@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.scss"],
})
export class TransactionsComponent implements OnInit {
  name = "Jon Rios for City Council";
  static_data: any;
  hideRequiredMarker: boolean = true;
  contribution: FormGroup;
  expenditure: FormGroup;
  loan: FormGroup;
  unpaid: FormGroup;
  sub_transForm: FormGroup;
  typeID = "TRN-CONT";
  getContributionType:any
  getTransactionType: any;
  conType:any;
  getContributorType: any;
  getMonetaryType: any;
  getExpenditureCatg: any;
  contributionType: string;
  entityName: any;
  entityId: any;
  searchContributorType: any;
  searchContact: any;
  txtQueryChanged: Subject<string> = new Subject<string>();
  searchpopular: any;
  data = this.commonMethods.getCurrentLanguage();
  getElectionTypeData: any;
  getState: any;
  getDetailsById: any;
  entityType: string;
  contactID: string;
  compareObj: any;
  contactUpdatedFlag: any;
  showexp: boolean = false;
  changeExpenditure: boolean = false;
  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    private urlService: MasterUrlService,
    public errorService: ErrorMessageService,
    private fb: FormBuilder,
    private service: ClientService,
    public router: Router,
    public snackbar: SnackbarService,
    private localStore: LocalstorageService,
    public dialog: MatDialog,
  ) {
    this.txtQueryChanged
    .pipe(
      debounceTime(1000),
      distinctUntilChanged()).subscribe(data => {
        this.searchContact = data;
        this.getContributorContact();
      })
  }
  changeTransType(e){
    this.contribution.get("contributorType").setValue("CON-I");
    if (e.isUserInput) {
        if ((this.contribution.dirty && this.typeID == "TRN-CONT")) {
        const options = {
          title: "Alert",
          message: "Are you sure you want to proceed without saving the changes?",
          cancelText: "Cancel",
          confirmText: "Yes",
        };
        const dialogRef = this.dialog.open(ConfirmPopupComponent, {
          panelClass: ["ourmodal", "small-modal"],
          disableClose: true,
          data: {
            title: options.title,
            message: options.message,
            cancelText: options.cancelText,
            confirmText: options.confirmText,
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.contribution.reset();
            this.typeID = e.source.value;
          }else{
            if(e.source.value == e.source._parent.value){
            this.typeID = "TRN-CONT";
            }else{
            this.typeID = e.source._parent.value
          }
          }
        });
      }
      if(this.typeID == 'TRN-EXPT'){
        this.showexp = true;
        if(this.changeExpenditure){
          console.log('abi')
        }
      }
    }
  }
  
  ngOnInit(): void {
   
    this.dataMatchingList.data = [
      {
        type: "hari",
        date: "56",
        amount: "56",
      },
    ];
    this.getStates();
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.getTransTypes();
    this.initExpenditureForm();
    this.initUnpaidForm();
    this.initLoanForm();
    if (this.typeID == 'TRN-CONT'){
    this.initContributionForm();
    this.getContributorTypes();
    this.getMonetaryTypes();
    this.getContributionTypes();
    this.getElectionTypeList();
    this.contribution.get("contributorType").setValue("CON-I");
    this.conType = 'CON-I'
    this.entityName = this.localStore.getLocalStorage('user_chosen');
    this.entityId = this.localStore.getLocalStorage('choosen_id');
    if(this.entityName == 'committee'){
      this.entityType = 'C'
    }else{
      this.entityType = 'IE'
    }
    }else if(this.typeID == 'TRN-EXPT'){
    this.getExpenditureCategory();
     }else if(this.typeID == 'TRN-UPOB'){

     }else{

     }
 
  }
 
  getStates() {
    this.service
      .getData(this.urlService.getStatesList)
      .subscribe((res: any) => {
        this.getState = res;
      });
  }
//Contribution
  initContributionForm() {
    this.contribution = this.fb.group({
      contributorType: [],
      SearchEvent:[],
      firstName: ["" || null, []],
      lastName: ["" || null, []],
      employer: ["" || null, []],
      occupation: ["" || null, []],
      voterId: ["" || null, []],
      Address1: [
        "" || null,
        [
          Validators.minLength(2),
          Validators.maxLength(150),
          Validators.pattern(this.masterDate.addressPattern),
        ],
      ],
      Address2: [
      "" || null,
        [
          Validators.minLength(2),
          Validators.maxLength(150),
          Validators.pattern(this.masterDate.addressPattern),
        ],
      ],
      city: ["" || null, []],
      state: ["" || null, [Validators.required]],
      zipcode: ["" || null, []],
      contributionType: ["" || null, []],
      monetaryType: ["" || null, []],
      dateReceived: ["" || null, [Validators.required]],
      contributionAmount: ["" || null, []],
      electionType: ["" || null, []],
      refund: ["" || null, []],
      refundDate: ["" || null, []],
      refundAmount: ["" || null, []],
      reasonForrefund: ["" || null, []],
      notes: ["" || null, []],
      description: ["" || null, []],
    });
  }
  check(event){
    this.contribution.value.refund = event.checked;
    if(event.checked){
      this.contribution.controls['refundDate'].setValidators([Validators.required]);
      this.contribution.controls['refundDate'].updateValueAndValidity();
      this.contribution.controls['refundAmount'].setValidators([Validators.required]);
      this.contribution.controls['refundAmount'].updateValueAndValidity();
      this.contribution.controls['reasonForrefund'].setValidators([Validators.required]);
      this.contribution.controls['reasonForrefund'].updateValueAndValidity();
    }else{
    this.contribution.controls['refundDate'].clearValidators();
    this.contribution.controls['refundDate'].updateValueAndValidity();
    this.contribution.controls['refundAmount'].clearValidators();
    this.contribution.controls['refundAmount'].updateValueAndValidity();
    this.contribution.controls['reasonForrefund'].clearValidators();
    this.contribution.controls['reasonForrefund'].updateValueAndValidity();
    }
  }
  changeContributor(e){
    if(e.lookUpTypeId == 'CON-I'){
    this.conType = 'CON-I'
  }else{
    this.conType = 'CON-O'
  }
  }
  changeContribution(e){
    if(e.lookUpTypeId == 'MON'){
    this.contributionType = 'MON'
    this.contribution.controls['monetaryType'].setValidators([Validators.required]);
    this.contribution.controls['monetaryType'].updateValueAndValidity();
  }else{
    this.contributionType = 'INK'
    this.contribution.controls['monetaryType'].clearValidators();
    this.contribution.controls['monetaryType'].updateValueAndValidity();
  }
  }
  getContributorContact() {
   let url =
    this.urlService.contributorContact + this.entityId+
    "&entityType=" +
    this.entityType +
    "&searchName=" +
    this.searchContact;
   this.service.getData(url).subscribe((res: any) => {
       this.searchContributorType = res;
     });
  }
  getTransTypes() {
    let lookUpTypeCode = "TRN-TYPE";
   this.service
     .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
     .subscribe((res: any) => {
        if(this.entityName == 'IE'){
       this.getTransactionType = [...res[0], ...res[4], ...res[2]];
        }else{
          this.getTransactionType = [...res[0], ...res[1], ...res[2], ...res[3],];
        }
     });
  }
  getContributorTypes() {
    let lookUpTypeCode = "CON-TYPE";
   this.service
     .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
     .subscribe((res: any) => {
       this.getContributorType = res;
     });
  }
  getContributionTypes() {
    let lookUpTypeCode = "CTN-TYPE";
   this.service
     .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
     .subscribe((res: any) => {
       this.getContributionType = res;
     });
  }
  getMonetaryTypes() {
    let lookUpTypeCode = "MON-TYPE";
   this.service
     .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
     .subscribe((res: any) => {
       this.getMonetaryType = res;
     });
  }
  getElectionTypeList() {
    this.service
      .getData(this.urlService.getElectionCycle)
      .subscribe((res: any) => {
        this.getElectionTypeData = res;
      });
  }
  getContactDetailsById(e) {
    this.contactID = e;
   this.service
     .getData(this.urlService.getContactDetailsById + this.contactID)
     .subscribe((res: any) => {
       this.getDetailsById = res;
       this.contribution.patchValue({
        contributorType: this.getDetailsById.contactType,
        firstName: this.getDetailsById.firstName,
        lastName: this.getDetailsById.lastName,
        employer: this.getDetailsById.orgName, 
        occupation: this.getDetailsById.occupation, 
        voterId: this.getDetailsById.voterId,
        Address1:this.getDetailsById.address1 ,
        Address2: this.getDetailsById.address2,
        city: this.getDetailsById.city,
        state: this.getDetailsById.stateCode,
        zipcode: this.getDetailsById.zipCode
       })
     });
  }
  commaKey(e){
    if(e == 'CA'){
    let number = (this.contribution.value.contributionAmount).split(',').join('');
    let numberVal = new Intl.NumberFormat('en-US').format(number);
    this.contribution.patchValue({
      contributionAmount : numberVal
  })
}else{
  let number = (this.contribution.value.refundAmount).split(',').join('');
  let numberVal = new Intl.NumberFormat('en-US').format(number);
  this.contribution.patchValue({
    refundAmount : numberVal
})
}
}
  clearForm(){
    this.contribution.controls['contributorType'].reset();
    this.contribution.controls['SearchEvent'].reset();
    this.contribution.controls['firstName'].reset();
    this.contribution.controls['lastName'].reset();
    this.contribution.controls['employer'].reset();
    this.contribution.controls['occupation'].reset();
    this.contribution.controls['voterId'].reset();
    this.contribution.controls['Address1'].reset();
    this.contribution.controls['Address2'].reset();
    this.contribution.controls['city'].reset();
    this.contribution.controls['state'].reset();
    this.contribution.controls['zipcode'].reset();
  }
  save(){
    if (this.getDetailsById){
      this.compareObj = {
        contactType: this.contribution.value.contributorType,
        firstName: this.contribution.value.firstName,
        middleName: "",
        lastName: this.contribution.value.lastName,
        orgName: this.contribution.value.employer, 
        occupation: this.contribution.value.occupation, 
        voterId: this.contribution.value.voterId,
        address1: this.contribution.value.Address1,
        address2: this.contribution.value.Address2,
        city: this.contribution.value.city,
        stateCode: this.contribution.value.state,
        zipCode: this.getDetailsById.zipCode
       }
       if(JSON.stringify(this.getDetailsById) == JSON.stringify(this.compareObj)){
         this.contactUpdatedFlag = false;
       }else{
        this.contactUpdatedFlag = true;
       }
    }else{
      this.contactUpdatedFlag = false;
    }
    if (this.contribution.valid){
    const id = {
      transactionId: 0,
      transactionVersionId: 0,
      entityId: this.entityId,
      entityType: this.entityType,
      contactInfo: {
        contactId: this.contactID?this.contactID:0,
        contactType: this.contribution.value.contributorType?this.contribution.value.contributorType:"",
        firstName: this.contribution.value.firstName?this.contribution.value.firstName:"",
        lastName: this.contribution.value.lastName?this.contribution.value.lastName:"",
        employerName: this.contribution.value.employer?this.contribution.value.employer:"",
        occupationDesc: this.contribution.value.occupation?this.contribution.value.occupation:"",
        voterId: this.contribution.value.voterId?this.contribution.value.voterId:"",
        caddress1: this.contribution.value.Address1?this.contribution.value.Address1:"",
        caddress2: this.contribution.value.Address2?this.contribution.value.Address2:"",
        cityName: this.contribution.value.city?this.contribution.value.city:"",
        stateCode: this.contribution.value.state?this.contribution.value.state:"",
        zipcode: this.contribution.value.zipcode?this.contribution.value.zipcode:"",
        contactUpdatedFlag: this.contactUpdatedFlag
      },
      transactionTypeId: this.typeID,
      transactionAmount: this.contribution.value.contributionAmount?parseInt(this.contribution.value.contributionAmount):0,
      transactionDate: this.contribution.value.dateReceived?this.contribution.value.dateReceived:null,
      electioncycleId: this.contribution.value.electionType?parseInt(this.contribution.value.electionType):0,
      refundOrPaidFlag: true,
      refundOrPaidDate: this.contribution.value.refundDate?this.contribution.value.refundDate:null,
      refundOrPaidAmount: this.contribution.value.refundAmount?parseInt(this.contribution.value.refundAmount):0,
      refundReason: this.contribution.value.reasonForrefund?this.contribution.value.reasonForrefund:"",
      parentTransactionId: 0,
      notes: this.contribution.value.notes?this.contribution.value.notes:"",
      contributionTypeId: this.contribution.value.contributionType?this.contribution.value.contributionType:"",
      monetaryTypeId: this.contribution.value.monetaryType?this.contribution.value.monetaryType:"",
      description:this.contribution.value.description?this.contribution.value.description:"",
      postElectionExemptFlag: false,
      transactionCategoryId: "",
      transactionPurpose: "",
      fairElectionFundFlag: false,
      electioneeringCommFlag: false,
      ieFlag: false,
      nonDonorFundFlag: false,
      nonDonorSource: "",
      nonDonorAmount: 0,
      methodOfCommunication: "",
      ieTargetType: "",
      positionDesc: "",
      ballotIssueId: 0,
      ballotIssueDesc: "",
      candidateName: "",
      officeSought: "",
      district: "",
      adminNotes: "",
      fefStatus: "",
      disbursementId: 0,
      userId: 0,
      roleType: "Contributor"
    }
    this.service
    .postData(this.urlService.saveContribution, id)
    .subscribe((res: any) => {
      if(res){
        this.contribution.reset();
        this.snackbar.snackbarError(
          "Contribution Added successfully",
          this.masterDate.centre
        );
      }
    })
  }else{
    this.contribution.markAllAsTouched();
  }
  }
  //Expenditure
  initExpenditureForm() {
    this.expenditure = this.fb.group({
      payeeType: ["" || null, []],
      firstName: ["", [Validators.minLength(2), Validators.maxLength(80)]],
      lastName: ["", [Validators.minLength(2), Validators.maxLength(80)]],
      Address1: [
        "" || null,
        [
          Validators.minLength(2),
          Validators.maxLength(150),
          Validators.pattern(this.masterDate.addressPattern),
        ],
      ],
      Address2: [
        "" || null,
        [
          Validators.minLength(2),
          Validators.maxLength(150),
          Validators.pattern(this.masterDate.addressPattern),
        ],
      ],
      city: ["" || null, []],
      state: ["" || null, [Validators.required]],
      zipcode: ["" || null, []],
      datePaid: ["" || null, []],
      amount: ["" || null, []],
      purpose: ["" || null, []],
      expenditureCatagory: ["" || null, []],
      refundDate: ["" || null, []],
      refundAmount: ["" || null, []],
      notes: ["" || null, []],
    });
  }
  getExpenditureCategory() {
    let lookUpTypeCode = "EXP-CAT";
   this.service
     .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
     .subscribe((res: any) => {
       this.getExpenditureCatg = res;
     });
  }
  //Unpaid
  initUnpaidForm() {
    this.unpaid = this.fb.group({
      payeeType: ["" || null, []],
      firstName: ["", [Validators.minLength(2), Validators.maxLength(80)]],
      lastName: ["", [Validators.minLength(2), Validators.maxLength(80)]],
      Address1: [
        "" || null,
        [
          Validators.minLength(2),
          Validators.maxLength(150),
          Validators.pattern(this.masterDate.addressPattern),
        ],
      ],
      Address2: [
        "" || null,
        [
          Validators.minLength(2),
          Validators.maxLength(150),
          Validators.pattern(this.masterDate.addressPattern),
        ],
      ],
      city: ["" || null, []],
      state: ["" || null, [Validators.required]],
      zipcode: ["" || null, []],
      datePaid: ["" || null, []],
      amount: ["" || null, []],
      purpose: ["" || null, []],
      expenditureCatagory: ["" || null, []],
      refundDate: ["" || null, []],
      refundAmount: ["" || null, []],
      notes: ["" || null, []],
    });
  }

  initLoanForm() {
    this.loan = this.fb.group({
      lenderType: ["" || null, []],
      firstName: ["", [Validators.minLength(2), Validators.maxLength(80)]],
      lastName: ["", [Validators.minLength(2), Validators.maxLength(80)]],
      Address1: [
        "" || null,
        [
          Validators.minLength(2),
          Validators.maxLength(150),
          Validators.pattern(this.masterDate.addressPattern),
        ],
      ],
      Address2: [
        "" || null,
        [
          Validators.minLength(2),
          Validators.maxLength(150),
          Validators.pattern(this.masterDate.addressPattern),
        ],
      ],
      city: ["" || null, []],
      state: ["" || null, [Validators.required]],
      zipcode: ["" || null, []],
      loanType: ["" || null, []],
      amount: ["" || null, []],
      dateReceived: ["" || null, []],
      endorser: ["" || null, []],
      guaranteed: ["" || null, []],
      termsOrRate: ["" || null, []],
      dueDate: ["" || null, []],
    });
  }
  initElectionCycleForm() {
    this.sub_transForm = this.fb.group({
      transaction_type: ["" || null, []],
      date: ["" || null, []],
      amount: ["" || null, []],
    });
  }
  dataMatchingList = new MatTableDataSource();
  displayedStudentsColumnsList: string[] = ["type", "date", "amount", "action"];
}

