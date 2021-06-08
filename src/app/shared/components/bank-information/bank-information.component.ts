import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonMethods, ErrorMessageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';

@Component({
  selector: 'app-bank-information',
  templateUrl: './bank-information.component.html',
  styleUrls: ['./bank-information.component.scss']
})
export class BankInformationComponent implements OnInit {

  hideRequiredMarker:boolean = true;
  @Output() bankEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() backBtnEmiter = new EventEmitter<Object>();
  bankForm: FormGroup;
  static_data: any;
  bankFormValue:any;
  stateList : any =[];

  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    private urlService: MasterUrlService,
    private service: ClientService,
    public snackbar: SnackbarService,

  ) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.bankInformationForm();
    this.getStateList();
  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  
  bankInformationForm () {
    this.bankForm = new FormGroup({
        bankName: new FormControl("" || null,[Validators.maxLength(120), Validators.pattern(this.masterDate.onlyAlphaNumber)]),
        address1: new FormControl("" || null,
        [Validators.minLength(1), Validators.maxLength(150),Validators.pattern(this.masterDate.addressPattern)]),
        address2: new FormControl("" || null,
        [Validators.minLength(1), Validators.maxLength(150),Validators.pattern(this.masterDate.addressPattern)]),
        city: new FormControl("" || null),
        state: new FormControl("" || null),
        zipcode: new FormControl("" || null),
    });
  }

  getStateList (){
    this.stateList =[];
    this.service.getData(this.urlService.getLookUpStateList).subscribe((res: any) => {
      this.stateList = res;
    })
  }


  submitBankForm(){
      this.bankFormValue = this.bankForm.value;
     console.log(JSON.stringify(this.bankFormValue));
     const controls = this.bankForm.controls;
     let valid = false;
     let validCount = 0;
      for (const name in controls) {
          if (controls[name].value && controls[name].value.length) {
              valid = true;
              validCount++;
          }
      }
 
     if (valid && validCount < 6) {
       // throw error
      return this.snackbar.snackbarError("Either skip or please enter all the fields", this.masterDate.centre);
     }
     this.bankEmitter.emit(this.bankFormValue)
     
  }
  goBack(){
    this.backBtnEmiter.emit(3)
  }

}
