import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';

@Component({
  selector: 'app-transactions-loan',
  templateUrl: './transactions-loan.component.html',
  styleUrls: ['./transactions-loan.component.scss']
})
export class TransactionsLoanComponent implements OnInit {
  loan: FormGroup;
  sub_transForm: FormGroup;
  static_data: any;
  hideRequiredMarker: boolean = true;
  getState: any;
  dataMatchingList = new MatTableDataSource();
  displayedStudentsColumnsList: string[] = ["type", "date", "amount", "action"];
  loanTypes:any;
  subContractTypes:any
  lenderTypes:any;
  subTransactions=[];
  subtransdata=[];
  conType:any;
  tempEditId;
  getDetailsById: any;
  data = this.commonMethods.getCurrentLanguage();
  contactID:any;
  searchPayeeType;
  entityName: any;
  entityId:any;
  entityType: string;
  searchContact: any;
  txtQueryChanged: Subject<string> = new Subject<string>();

  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    private fb: FormBuilder,
    private service: ClientService,
    public errorService: ErrorMessageService,
    private localStore: LocalstorageService,
    private urlService: MasterUrlService,
    public snackbar: SnackbarService) {
      this.txtQueryChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()).subscribe(data => {
          this.searchContact = data;
          this.getContributorContact();
        })
    }


  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.getStates();
    this.initLoanForm();
    this.initElectionCycleForm();
    this.getSubtransactionTypes();
    this.getLenderTypes();
    this.getLoanTypes();
    this.entityName = this.localStore.getLocalStorage('user_chosen');
    this.entityId = this.localStore.getLocalStorage('choosen_id');

    if(this.entityName == 'committee'){
      this.entityType = 'L'
    }else{
      this.entityType = 'IE'
    }
  }


  getStates() {
    this.service
      .getData(this.urlService.getStatesList)
      .subscribe((res: any) => {
        this.getState = res;
      });
  }

  initLoanForm() {
    this.loan = this.fb.group({
      lenderType: ["" || null, []],
      firstName: ["", [Validators.minLength(2), Validators.maxLength(80)]],
      lastName: ["", [Validators.minLength(2), Validators.maxLength(80)]],
      employer:["" || null, []],
      occupation:["" || null, []],
      voterId:["" || null, []],
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
      dateReceived: ["" || null, [Validators.required]],
      endorser: ["" || null, []],
      guaranteed: ["" || null, []],
      termsOrRate: ["" || null, []],
      dueDate: ["" || null, [Validators.required]],
    });
  }

  initElectionCycleForm() {
    this.sub_transForm = this.fb.group({
      transaction_type: ["" || null, []],
      dateReceived: ["" || null, [Validators.required]],
      amount: ["" || null, []],
    });
  }


  getSubtransactionTypes(){
    let lookUpTypeCode = "SUBTRANSACTIONS";
    this.service
      .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
      .subscribe((res: any) => {
        this.subContractTypes = res;
      });
  }

  getLenderTypes(){
    let lookUpTypeCode = "CON-TYPE";
    this.service
      .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
      .subscribe((res: any) => {
        this.lenderTypes = res;
      });
  }

  getLoanTypes(){
    let lookUpTypeCode = "LOAN";
    this.service
      .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
      .subscribe((res: any) => {
        this.loanTypes = res;
      });
  }
  numericOnly(event) {
    let patt = /^([0-9.])$/;
    let result = patt.test(event.key);
    return result;
  }

  clearForm(){
    this.loan.patchValue({
      lenderType:'',
      firstName:'',
      lastName:'',
      employer:'',
      occupation:'',
      voterId:'',
      Address1:'',
      Address2:'',
      city:'',
      state:'',
      zipcode:'',
      loanType:'',
      amount:'',
      dateReceived:'',
      endorser:'',
      guaranteed:'',
      termsOrRate:'',
      dueDate:'',
    })
  }

  addSubTransaction(){
    let now = new Date();
    let newTime = now.getDate()+''+now.getMonth()+''+now.getHours()+''+now.getMinutes()+''+now.getSeconds();

    if(this.sub_transForm.valid){
      if(this.tempEditId){
        for(let transa of this.subtransdata){
          if(transa.id === this.tempEditId){
            transa.sub_transactiontype = this.sub_transForm.value.transaction_type;
            transa.sub_transactionAmount = parseInt(this.sub_transForm.value.amount);
            transa.sub_transaction_date = this.sub_transForm.value.dateReceived;
          }
        }
        for(let transa of this.subTransactions){
          if(transa.id === this.tempEditId){
            transa.type = this.sub_transForm.value.transaction_type;
            transa.amount = this.sub_transForm.value.amount;
            transa.date = this.sub_transForm.value.dateReceived;
          }
        }
        this.dataMatchingList.data = [...this.subTransactions]
        this.tempEditId = '';
      }else{
        this.subtransdata.push({
          id:newTime,
          sub_transactiontype: this.sub_transForm.value.transaction_type,
          sub_transactionAmount: parseInt(this.sub_transForm.value.amount),
          sub_transaction_date: this.sub_transForm.value.dateReceived,
        })
        this.subTransactions.push({
          id:newTime,
          type: this.sub_transForm.value.transaction_type,
          amount: this.sub_transForm.value.amount,
          date: this.sub_transForm.value.dateReceived,
        })
        this.sub_transForm.patchValue({
          transaction_type: '',
          dateReceived:'',
          amount: '',
        })
        this.dataMatchingList.data = [...this.subTransactions]
      }
    }
  }

  editSubTrans(ele){
    for(let trans of this.subTransactions){
      this.tempEditId = ele.id;
      if(trans.id === ele.id){
        this.sub_transForm.patchValue({
          transaction_type: ele.type,
          dateReceived:ele.date,
          amount: ele.amount,
        })
      }
    }
  }

  deleteSubTrans(ele){
    this.subTransactions.forEach((element,index)=>{
      if(element.id==ele.id) this.subTransactions.splice(index,1);
   });
   this.subtransdata.forEach((element,index)=>{
    if(element.id==ele.id) this.subTransactions.splice(index,1);
 });
   this.dataMatchingList.data = [...this.subTransactions]
  }

  saveLoan(){
    if(this.loan.valid){
      let data = {
        contact_id: this.contactID?this.contactID:0,
        entity_type: this.entityType,
        contact_Type: this.loan.value.lenderType,
        entity_id: 192,
        lendertype: this.loan.value.lenderType,
        firstname: this.loan.value.firstName,
        lastname: this.loan.value.lastName,
        employee: this.loan.value.employer,
        occupation: this.loan.value.occupation,
        voterId: this.loan.value.voterId?parseInt(this.loan.value.voterId):0,
        address1: this.loan.value.Address1,
        address2:this.loan.value.Address2,
        city: this.loan.value.city,
        state: this.loan.value.state,
        zip: parseInt(this.loan.value.zipcode),
        loanType: this.loan.value.loanType,
        date_loan: this.loan.value.dateReceived,
        amount: parseInt(this.loan.value.amount),
        name_of_guarantor_or_endorser: this.loan.value.endorser,
        amount_Guaranteed: parseInt(this.loan.value.guaranteed),
        interest_teams: this.loan.value.termsOrRate,
        duedate: this.loan.value.dueDate,
        contactupdatedflag: true,
        loanId: 0,
        subtransactions: this.subtransdata
      }
      this.service.postData(this.urlService.saveLoan,data).subscribe((res)=>{
        this.loan.reset();
        this.snackbar.snackbarError(
          "Loan Added successfully",
          this.masterDate.centre
        );
      },err=>{
        console.log(err);
      })
    }else{
      this.loan.markAllAsTouched();
      this.sub_transForm.markAllAsTouched();
    }
  }

  changeContributor(e){
    if(e.lookUpTypeId == 'CON-I'){
    this.conType = 'CON-I'
  }else{
    this.conType = 'CON-O'
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
       this.loan.patchValue({
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
}
