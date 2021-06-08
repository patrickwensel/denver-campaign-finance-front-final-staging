import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonMethods, ErrorMessageService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { MasterDataService } from "./../../../configs/master-data";
import { Location } from "@angular/common";

@Component({
  selector: 'app-lobbyist-registration',
  templateUrl: './lobbyist-registration.component.html',
  styleUrls: ['./lobbyist-registration.component.scss']
})
export class LobbyistRegistrationComponent implements OnInit {
  @Output() LobbyRegistration = new EventEmitter<Object>();
  @Input() LobbyRegistrationDate:any = {}
  static_data: any;
  LobbyRegisterForm: FormGroup;
  lobbyRegisForm:any;
  hideRequiredMarker: boolean = true;
  stateList:any;
  LobbyType:any;
  dateNow : Date = new Date();
  currentYear = this.dateNow.getFullYear();
  firmView =false;
  value:any;
  curYear = new Date().getFullYear();

  constructor( private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    private service: ClientService,
    public router: Router,
    public snackbar: SnackbarService,
    private location: Location,
    private urlService: MasterUrlService){

  }
  ngOnInit()
  {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.initCreateForm(this.LobbyRegistrationDate);
    this.getStateList();
    this.getLobbyType();
  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  
  getStateList (){

    this.stateList =[];
    this.service.getData(this.urlService.getStatesList).subscribe((res: any) => {
      this.stateList = res;
      console.log(res);
    })
  }
  // getLobbyType(){
  //   this.service.postData(this.urlService.lookupGetList,{"lookUpType": "LOB"}).subscribe((res: any) => {
  //     this.LobbyType = res;
  //    })
  //     }

      getLobbyType (){
        let lobbyType = "LOB_TYPE"
        this.LobbyType =[];
        this.service.getData(this.urlService.getLookuplist + lobbyType).subscribe((res: any) => {
          this.LobbyType = res;
          console.log(res);
        })
      }


  initCreateForm(LobbyRegistrationDate:any) {
    this.LobbyRegisterForm = new FormGroup({
      year: new FormControl(LobbyRegistrationDate.year || this.currentYear,
        [Validators.required, Validators.min(1000),Validators.max(this.curYear),Validators.minLength(4),Validators.maxLength(4)]),
      lobbyType: new FormControl(LobbyRegistrationDate.type || null,
        [Validators.required]),
      firstName: new FormControl(LobbyRegistrationDate.firstName || null,
        [Validators.required,Validators.minLength(2), Validators.maxLength(80)]),
      lastName: new FormControl(LobbyRegistrationDate.lastName || null,
        [Validators.required,Validators.minLength(2), Validators.maxLength(80)]),
      firmName: new FormControl(LobbyRegistrationDate.organisationName || null,[]),
      address1: new FormControl(LobbyRegistrationDate.address1 || null,
        [Validators.minLength(2), Validators.maxLength(150), Validators.pattern(this.masterDate.addressPattern)]),
      address2: new FormControl(LobbyRegistrationDate.address2 || null, [Validators.minLength(2), Validators.maxLength(150), Validators.pattern(this.masterDate.addressPattern)]),
      phone: new FormControl(LobbyRegistrationDate.phone || null,
        [Validators.maxLength(10),Validators.pattern(this.masterDate.phoneNumerhipenvalidation)]),
      zipcode: new FormControl(LobbyRegistrationDate.zipCode || null, [Validators.required,Validators.minLength(5),Validators.maxLength(9),Validators.pattern(this.masterDate.zipcodePattern)]),
      city: new FormControl(LobbyRegistrationDate.city|| null, [Validators.required]),
      state: new FormControl(LobbyRegistrationDate.stateCode || null, [Validators.required]),
      email: new FormControl(LobbyRegistrationDate.email || null,
        [Validators.pattern(this.masterDate.emailValidations)])

    });
  }

  ValidateLobbyistRegister(){
    if (this.LobbyRegisterForm.valid) {
      this.lobbyRegisForm = this.LobbyRegisterForm.value;
     console.log(JSON.stringify(this.lobbyRegisForm));
    //  const params = {

    //     "year": "2021",
    //     "lobbyistType": "O",
    //     "filerContactID": 10,
    //     "lobbyistDetail": {
    //     "firstName": this.LobbyRegisterForm.controls.firstName.value,
    //     "lastName": this.LobbyRegisterForm.controls.lastName.value,
    //     "organizationName": this.LobbyRegisterForm.controls.firmName.value,
    //     "address1": this.LobbyRegisterForm.controls.address1.value,
    //     "address2": this.LobbyRegisterForm.controls.address2.value,
    //     "city": this.LobbyRegisterForm.controls.city.value,
    //     "stateCode": this.LobbyRegisterForm.controls.state.value,
    //     "zip":this.LobbyRegisterForm.controls.zipcode.value,
    //     "email": this.LobbyRegisterForm.controls.email.value,
    //     "phone": this.LobbyRegisterForm.controls.phone.value

    //     }
    //  }
    //  this.service.postData(this.urlService.saveLobbyist,params).subscribe((res: any) => {
    //    debugger
    //    console.log(res);
    //    this.snackbar.snackbarSuccess("Lobbyist Details Added Successfully");

    //  })
     this.LobbyRegistration.emit(this.lobbyRegisForm)
   }
   else {
     this.LobbyRegisterForm.markAllAsTouched();
   }
 }
 navigate(){
   this.router.navigate(['/login'])
 }
 valueChange(value:any) {
  if(this.value=="Individual"){
   this.firmView=true
  }
  else{
    this.firmView=false
  }
}

goBack() {
  this.location.back();

}

  }


