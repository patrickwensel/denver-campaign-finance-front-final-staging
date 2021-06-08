import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';

@Component({
  selector: 'app-transactions-expenditure',
  templateUrl: './transactions-expenditure.component.html',
  styleUrls: ['./transactions-expenditure.component.scss']
})
export class TransactionsExpenditureComponent implements OnInit, OnChanges{
  @Input() showexp;
  @Output() changeExpenditure: EventEmitter<any> = new EventEmitter<any>();
  static_data: any;
  expenditure: FormGroup;
  hideRequiredMarker: boolean = true;
  getState: any;
  payeeTypes:any;
  txtQueryChanged: Subject<string> = new Subject<string>();
  entityName: any;
  entityId:any;
  entityType: string;
  searchContact: any;
  searchPayeeType;
  contactID:any;
  getDetailsById: any;
  data = this.commonMethods.getCurrentLanguage();
  conType:any;
  getExpenditureCatg;
  fairElection:boolean=false;
postElection:boolean=false;
refundElection:boolean=false;
  constructor(
    private commonMethods: CommonMethods,
    private fb: FormBuilder,
    public masterDate: MasterDataService,
    private urlService: MasterUrlService,
    private service: ClientService,
    private localStore: LocalstorageService,
    public errorService: ErrorMessageService,
    public snackbar: SnackbarService,
    ) {
      this.txtQueryChanged
    .pipe(
      debounceTime(1000),
      distinctUntilChanged()).subscribe(data => {
        this.searchContact = data;
        this.getContributorContact();
      })
     }
  ngOnChanges(){
    if(this.showexp){
     this.changeExpenditure.emit(true);
    }
  }
  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.getStates();
    this.getPayeeTypes();
    this.initExpenditureForm();
    this.getExpenditureCategory();
    this.entityName = this.localStore.getLocalStorage('user_chosen');
    this.entityId = this.localStore.getLocalStorage('choosen_id');

    if(this.entityName == 'committee'){
      this.entityType = 'L'
    }else{
      this.entityType = 'IE'
    }
  }

  getPayeeTypes(){
    let lookUpTypeCode = "CON-TYPE";
    this.service
      .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
      .subscribe((res: any) => {
        this.payeeTypes = res;
      });
  }
  initExpenditureForm() {
    this.expenditure = this.fb.group({
      SearchEvent:[],
      payeeType: ["" || null, []],
      firstName: ["", [Validators.minLength(2), Validators.maxLength(80)]],
      lastName: ["", [Validators.minLength(2), Validators.maxLength(80)]],
      organization: ["", [Validators.minLength(2), Validators.maxLength(80)]],
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
      fairElection: ["" || null, []],
postElection: ["" || null, []],
refundElection: ["" || null, []],
    });
  }

  clearForm(){
    this.expenditure.patchValue({
      payeeType: '',
      firstName: '',
      lastName: '',
      organization:'',
      Address1: '',
      Address2:'',
      city: '',
      state: '',
      zipcode: '',
      datePaid: '',
      amount: '',
      purpose: '',
      expenditureCatagory: '',
      refundDate: '',
      refundAmount: '',
      notes: '',
      fairElection:'',
postElection:'',
refundElection:'',
    })
  }

  numericOnly(event) {
    let patt = /^([0-9.])$/;
    let result = patt.test(event.key);
    return result;
  }

  getStates() {
    this.service
      .getData(this.urlService.getStatesList)
      .subscribe((res: any) => {
        this.getState = res;
      });
  }

  saveExpenditure(){
    if(this.expenditure.valid){
      let data={
        "transactionId": 0,
        "transactionVersionId": 0,
        "entityId": 192,
        "entityType": this.entityType,
        "contactInfo": {
          "contactId": this.contactID?this.contactID:0,
          "contactType": this.expenditure.value.payeeType,
          "firstName": this.expenditure.value.firstName?this.expenditure.value.firstName:"",
          "lastName": this.expenditure.value.lastName?this.expenditure.value.lastName:"",
          "occupationDesc": "",
          "employerName": this.expenditure.value.organization?this.expenditure.value.organization:"",
          "voterId": "",
          "caddress1":this.expenditure.value.Address1,
          "caddress2":this.expenditure.value.Address2,
          "cityName": this.expenditure.value.city,
          "stateCode" :this.expenditure.value.state,
          "zipcode":this.expenditure.value.zipcode,
          "contactUpdatedFlag": true
        },
        "transactionTypeId": "",
        "transactionAmount": parseInt(this.expenditure.value.amount),
        "transactionDate": this.expenditure.value.datePaid,
        "electioncycleId": 0,
        "refundOrPaidFlag": this.refundElection,
        "refundOrPaidDate": this.expenditure.value.refundDate,
        "refundOrPaidAmount": parseInt(this.expenditure.value.refundAmount),
        "refundReason": "",
        "parentTransactionId": 0,
        "notes": this.expenditure.value.notes,
        "contributionTypeId": "",
        "monetaryTypeId": "",
        "postElectionExemptFlag": this.postElection,
        "transactionCategoryId": this.expenditure.value.expenditureCatagory,
        "transactionPurpose": this.expenditure.value.purpose,
        "fairElectionFundFlag": this.fairElection,
        "electioneeringCommFlag": false,
        "ieFlag": false,
        "nonDonorFundFlag": true,
        "nonDonorSource": "",
        "nonDonorAmount": 0,
        "methodOfCommunication": "",
        "ieTargetType": "",
        "positionDesc": "",
        "ballotIssueId": 0,
        "ballotIssueDesc": "",
        "candidateName": "",
        "officeSought": "",
        "district": "",
        "adminNotes": "",
        "fefStatus": "",
        "disbursementId": 0,
        "userId": 1,
        "roleType": "Payee"
      }
      this.service.postData(this.urlService.saveExpenditure,data).subscribe((res)=>{
        this.expenditure.reset();
        this.snackbar.snackbarError(
          "Expenditure Added successfully",
          this.masterDate.centre
        );
      },err=>{
        console.log(err);
      })
    }else{
      this.expenditure.markAllAsTouched();
    }
  }

  getContributorContact() {
    if(this.entityName == 'committee'){
      this.entityType = 'C'
    }else{
      this.entityType = 'IE'
    }
   let url =
    this.urlService.contributorContact + this.entityId+
    "&entityType=" +
    this.entityType +
    "&searchName=" +
    this.searchContact;
   this.service.getData(url).subscribe((res: any) => {
       this.searchPayeeType = res;
     });
  }
  getContactDetailsById(e) {
    this.contactID = e;
   this.service
     .getData(this.urlService.getContactDetailsById + this.contactID)
     .subscribe((res: any) => {
       this.getDetailsById = res;
       this.expenditure.patchValue({
        payeeType: this.getDetailsById.contactType,
        firstName: this.getDetailsById.firstName,
        lastName: this.getDetailsById.lastName,
        employer: this.getDetailsById.occupation,
        occupation: this.getDetailsById.occupation,
        organization: this.getDetailsById.orgName,
        voterId: this.getDetailsById.voterId,
        Address1:this.getDetailsById.address1 ,
        Address2: this.getDetailsById.address2,
        city: this.getDetailsById.city,
        state: this.getDetailsById.stateCode,
        zipcode: this.getDetailsById.zipCode
       })
     });
  }

  changeContributor(e){
    if(e.lookUpTypeId == 'CON-I'){
    this.conType = 'CON-I'
  }else{
    this.conType = 'CON-O'
  }
  }

  getExpenditureCategory() {
    let lookUpTypeCode = "EXP-CAT";
   this.service
     .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
     .subscribe((res: any) => {
       this.getExpenditureCatg = res;
     });
  }

  faircheck(ev){
    this.fairElection = ev.checked;
  }
  postcheck(ev){
    this.postElection = ev.checked;
  }
  refundcheck(ev){
    this.refundElection = ev.checked;
  }
}
