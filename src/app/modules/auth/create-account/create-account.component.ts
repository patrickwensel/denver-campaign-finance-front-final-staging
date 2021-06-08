import { error } from "@angular/compiler/src/util";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CommonMethods,
  ErrorMessageService,
  LocalstorageService,
  MasterUrlService,
  SnackbarService,
} from "src/app/core";
import { ClientService } from "src/app/core/api-services/client.service";
import { CreateAccountService } from "src/app/core/services/create-account.service";
import { DataService } from "src/app/core/services/data-service";
import { MasterDataService } from "./../../../configs/master-data";
@Component({
  selector: "app-create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.scss"],
})
export class CreateAccountComponent implements OnInit {
  hideRequiredMarker: boolean = true;
  showInformation: boolean = false;
  showPassword = true;
  showUsertype = true;
  pshow = true;
  hide = true;
  static_data: any = [];
  createInformationForm: FormGroup;
  setPasswordForm: FormGroup;
  independentExpenditureForm: FormGroup;
  contactSubmitForm: FormGroup;
  typeID: string;
  showCommitee: boolean = true;
  selectedCommLobbList: any = [];
  showTab: boolean = true;
  selectIndex: any = 0;
  showCommitteOrLobby: boolean = false;
  showIEF: boolean;
  modal: any;
  contactInformationId: any;
  passwordCompare: boolean;
  getUserType: any;
  selectedsel: any;
  getState: any;
  filerTypes: any;
  filerRole: any;
  role: any;
  getCommitteeList: any;
  listData: any;
  getLobbyList: any;
  confirm: boolean;
  selectCommittee: any;
  hideBack: boolean;
  hideNext: boolean = false;
  maxDate: Date = new Date(2021, 0, 1);
  account = "account";
  subscribe: any;
  userId: any;
  userType: any;
  contactId: any;
  emailExist: boolean;
  UserEmailID: any;
  confirmScreen: any = [];
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
    private data: DataService,
    public route: ActivatedRoute,
    public signIn: CreateAccountService
  ) {
    //for reload
  }

  ngOnInit(): void {
    this.route?.queryParams.subscribe((params: any) => {
      this.userType = params["userType"];
      this.contactId = params["userId"];
    });
    this.data.currentMessage.subscribe((message) => {
      if (message == "call create account") {
        // this.contactInformationId = parseInt(this.userId);
        this.typeID = this.userType;
        this.selectIndex = 3;
      }
    });

    this.commonMethods.isReloaded("false");
    // this.getCommittee();
    // this.getLobby();
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.initCreateForm();
    this.initsetPassword();
    this.independentExpenditureFilerForm();
    this.initSubmitForm();
    this.getStates();
    this.getAllUserType();
    //for testing
    // this.showCommitee = true;
    // this.showTab = false;
    this.setContactId();
  }

  setContactId(){
    if(!this.contactInformationId && this.localStore.getLocalStorage('contactId')){
      this.contactInformationId = this.localStore.getLocalStorage('contactId');
      }
  }
  getAllUserType() {
     let lookUpTypeCode = "AC";
    this.service
      .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
      .subscribe((res: any) => {
        this.getUserType = res;
      });
  }
  getStates() {
    this.service
      .getData(this.urlService.getStatesList)
      .subscribe((res: any) => {
        this.getState = res;
        console.log(this.getState);
      });
  }
  showSelectOrCreate(showSel: any) {
    console.log(showSel);
    this.showCommitteOrLobby = false;
    if (showSel) {
      this.selectedsel = showSel;
      this.showCommitteOrLobby = showSel;
      if (this.selectedCommLobbList.length > 0) {
        this.hideNext = false;
      }
    } else {
      if (this.showCommitee) {
        //Need to pass userId and UserType
        this.router.navigate(["/committee/committee-registration"], {
          queryParams: {
            contactId: this.contactInformationId,
            userType: this.role || this.userType,
          },
        });
      } else {
        this.router.navigate(["/lobbyist/createlobbyist"], {
          queryParams: {
            contactId: this.contactInformationId,
            userType: this.role || this.userType,
          },
        });
      }
    }
  }
  navigate(data: any) {
    if (data) {
      //Need to pass userId and UserType
      this.router.navigate(["/committee/committee-registration"], {
        queryParams: {
          contactId: this.contactInformationId,
          userType: this.role || this.userType,
        },
      });
    } else {
      this.router.navigate(["/lobbyist/createlobbyist"], {
        queryParams: {
          contactId: this.contactInformationId,
          userType: this.role || this.userType,
        },
      });
    }
  }

  deleteSelectedList(e: any) {
    //TODO remove selected lobby/Committee from list
    console.log("need to do remove selected lobby/Committee from list", e.data);
    if (this.selectedCommLobbList.length <= 1){
    return this.snackbar.snackbarError(this.showCommitee?
      "Minimum one committee is required":"Minimum one lobbyist is required",
      this.masterDate.centre
    );
    }else{
      this.selectedCommLobbList.splice(e.idx, 1);
    }
    if (this.selectedCommLobbList.length == 0) {
      this.hideNext = true;
    }
  }

  addSelectedtoList(data: any) {
    this.listData = data;
    //TODO add selected lobby/Committee to list
    console.log("need to do add selected lobby/Committee from list", data);
    if (this.selectedCommLobbList.length < 10) {
      let findLockerProduct;
      if (this.showCommitee) {
        findLockerProduct = this.selectedCommLobbList.find(
          (o: any) => o.committeeId == data.committeeId
        );
      } else {
        findLockerProduct = this.selectedCommLobbList.find(
          (o: any) => o.lobbyistID == data.lobbyistID
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
      }
    } else {
      this.snackbar.snackbarError(
        "Maximum Limit Reached",
        this.masterDate.centre
      );
    }
  }

  changeType() {
    this.selectedCommLobbList = [];
    this.filerRole = "";
    this.independentExpenditureForm.reset();
  }
  initCreateForm() {
    this.createInformationForm = this.fb.group({
      firstName: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(80),
        ],
      ],
      lastName: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(80),
        ],
      ],
      mailingAdd1: [
        "" || null,
        [
          Validators.minLength(2),
          Validators.required,
          Validators.maxLength(150),
          Validators.pattern(this.masterDate.addressPattern),
        ],
      ],
      mailingAdd2: [
        "" || null,
        [
          Validators.minLength(2),
          Validators.maxLength(150),
          Validators.pattern(this.masterDate.addressPattern),
        ],
      ],
      phone: ["" || null, [Validators.required, Validators.maxLength(10),Validators.pattern(this.masterDate.onlyNumberPattern)]],
      zipcode: ["" || null, [Validators.required]],
      city: ["" || null, [Validators.required]],
      state: ["" || null, [Validators.required]],
      email: ["" || null, []],
    });
  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  setData() {
    this.contactSubmitForm.patchValue({
      firstName: this.signIn.data.firstName,
      lastName: this.signIn.data.lastName,
      mailingAdd1: this.signIn.data.mailingAddress1,
      mailingAdd2: this.signIn.data.mailingAddress2,
      phone: this.signIn.data.phone,
      zipcode: this.signIn.data.zipcode,
      city: this.signIn.data.city,
      state: this.signIn.data.state,
      email: this.signIn.data.email,
      occupation: this.signIn.data.occupation,
      employer: this.signIn.data.employer,
      organization:this.signIn.data.organization
    });
  }
  initSubmitForm() {
    this.contactSubmitForm = this.fb.group({
      firstName: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(80),
        ],
      ],
      lastName: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(80),
        ],
      ],
      mailingAdd1: [
        "" || null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(150),
          Validators.pattern(this.masterDate.addressPattern),
        ],
      ],
      mailingAdd2: [
        "" || null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(150),
          Validators.pattern(this.masterDate.addressPattern),
        ],
      ],
      phone: [
        "" || null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(this.masterDate.onlyNumberPattern),
        ],
      ],
      zipcode: ["" || null, [Validators.required]],
      city: ["" || null, [Validators.required]],
      state: ["" || null, [Validators.required]],
      email: ["" || null, [Validators.required]],
      occupation: ["" || null, []],
      employer: ["" || null, []],
      organization: ["" || null, []],
    });
  }
  initsetPassword() {
    this.setPasswordForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(120),
          Validators.pattern(this.masterDate.emailValidations),
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern(this.masterDate.password),
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
      confirmpassword: ["", [Validators.required]],
    });
  }

  independentExpenditureFilerForm() {
    this.independentExpenditureForm = this.fb.group({
      filerType: ["", [Validators.required]],
      occupation: [""],
      employer: [""],
      organization: [""],
    });
  }
  comparePassword() {
    const password = this.setPasswordForm.value.password;
    const confirmpassword = this.setPasswordForm.value.confirmpassword;
    if (password && confirmpassword) {
      if (password === confirmpassword) {
        this.passwordCompare = false;
      } else {
        this.passwordCompare = true;
      }
    } else {
      this.passwordCompare = true;
    }
  }
  switchkey() {
    this.showTab = !this.showTab;
  }
  changevalue() {
    this.filerRole = this.independentExpenditureForm.value.filerType;
    if(this.filerRole == "FT-ORG"){
      this.independentExpenditureForm.controls['organization'].setValidators([Validators.required]),
      this.independentExpenditureForm.controls['organization'].updateValueAndValidity()
      this.independentExpenditureForm.controls['employer'].clearValidators()
      this.independentExpenditureForm.controls['occupation'].clearValidators()
      this.independentExpenditureForm.patchValue({
         employer : "",
         occupation : ""
      });
    }else{
      this.independentExpenditureForm.controls['employer'].setValidators([Validators.required]),
      this.independentExpenditureForm.controls['employer'].updateValueAndValidity()
      this.independentExpenditureForm.controls['occupation'].setValidators([Validators.required]),
      this.independentExpenditureForm.controls['occupation'].updateValueAndValidity()
      this.independentExpenditureForm.controls['organization'].clearValidators()
      this.independentExpenditureForm.patchValue({
        organization : "",
     });
    }
  }
  changeState(e: any) {
    this.createInformationForm.value.state = e.stateCode;
  }
  getFiler() {
     let lookUpTypeCode = "FILER-TYPE";
    this.service
      .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
      .subscribe((res: any) => {
        console.log(res);
        this.filerTypes = res;
        // this.independentExpenditureForm.patchValue({
        //   filerType: this.filerTypes[1].lookUpTypeId})
      });
  }
  addSearchEmitter(e: any) {
    this.selectCommittee = e;
    if (this.role == "AC-CAN" || this.role == "AC-TST") {
      this.getCommittee();
    } else {
      this.getLobby();
    }
  }
  getCommittee() {
    let url;
    const searchCommittee = this.selectCommittee
      ? this.selectCommittee
      : "%";
    const committeetype = "All";
    url =
      this.urlService.committeeByName +
      "?searchCommittee=" +
      searchCommittee +
      "&committeetype=" +
      committeetype;
    this.service.getData(url).subscribe((res: any) => {
      this.getCommitteeList = res;
    });
  }
  getLobby() {
     let searchLobbyName = this.selectCommittee ? this.selectCommittee : "%";
    this.service
      .getData(this.urlService.getlobbyByName + searchLobbyName)
      .subscribe((res: any) => {
        this.getLobbyList = res;
        console.log(this.getLobbyList);
      });
  }

  createInformation() {
    this.modal = {
      contactDetail: {
        contactID: 0,
        firstName: this.createInformationForm.value.firstName.trim(),
        lastName: this.createInformationForm.value.lastName.trim(),
        address1: this.createInformationForm.value.mailingAdd1
          ? this.createInformationForm.value.mailingAdd1
          : "",
        address2: this.createInformationForm.value.mailingAdd2
          ? this.createInformationForm.value.mailingAdd2
          : "",
        city: this.createInformationForm.value.city,
        stateCode: this.createInformationForm.value.state,
        zip: this.createInformationForm.value.zipcode,
        email: this.setPasswordForm.value.email.toLowerCase(),
        phone: this.createInformationForm.value.phone,
      },
      userAccountDetails: {
        password: this.setPasswordForm.value.password,
      },
    };
    this.service
      .postData(this.urlService.createAccount, this.modal)
      .subscribe((res: any) => {
        if (res[0].hasError) {
          console.log('error',res);
        } else {
          console.log('success',res);
          this.contactInformationId = res[0].pkId;
          this.localStore.setLocalStorage("contactId", res[0].pkId);
          this.selectIndex += 1;
          this.localStore.setLocalStorage(
            "firstName",
            this.createInformationForm.value.firstName
          );
          this.localStore.setLocalStorage(
            "contactId",
            res[0].pkId
          );
          this.localStore.setLocalStorage(
            "lastName",
            this.createInformationForm.value.lastName
          );
          this.localStore.setLocalStorage(
            "email",
            this.setPasswordForm.value.email
          );
          // this.localStore.setLocalStorage(this.masterDate.userId, res[0].pkId);

          // this.getUserDetails(res[0].pkId);
        }
      });
  }
  checkEmail() {
    this.emailExist = false;
    this.UserEmailID = this.setPasswordForm.value.email.toLowerCase();
    this.service
      .postData(this.urlService.validateEmailCheck + this.UserEmailID, {})
      .subscribe((res: any) => {
        if (res[0].pkId == 1) {
          this.emailExist = true;
        } else {
          this.emailExist = false;
        }
      });
  }
  changeEmail(){
    this.emailExist = false;
  }
  getUserDetails(_userId: any) {
    // Need to get User Detail
    //localhost:54061/api/UserManagement/GetUserDetails?UserID=286
    // http: this.subscribe = this.service
    //   .postData(`${this.urlService.getUserDetailUrl}${_userId}`, {})
    //   .subscribe((res) => {
    this.service
      .postData(this.urlService.getUserDetailUrl , {})
      .subscribe((res: any) => {
        if (res.hasError || !res.length) {
          if (res.message) {
            return this.snackbar.snackbarError(res.message, "center");
          }
        }
        this.localStore.setLocalStorage(this.masterDate.userDetail, res[0]);
      });
  }
  next() {
    switch (this.selectIndex) {
      case 0:
        if (this.createInformationForm.valid) {
          this.selectIndex += 1;
        } else {
          this.createInformationForm.markAllAsTouched();
        }
        // this.selectIndex += 1;
        break;
      case 1:
        this.comparePassword();
        if (this.setPasswordForm.valid && this.passwordCompare == false) {
        this.createInformation();
          this.signIn.data.firstName = this.createInformationForm
            .get("firstName")
            .value.trim();
          this.signIn.data.lastName = this.createInformationForm
            .get("lastName")
            .value.trim();
          this.signIn.data.mailingAddress1 = this.createInformationForm.get(
            "mailingAdd1"
          ).value;
          this.signIn.data.mailingAddress2 = this.createInformationForm.get(
            "mailingAdd2"
          ).value;
          this.signIn.data.phone = this.createInformationForm.get(
            "phone"
          ).value;
          this.signIn.data.zipcode = this.createInformationForm.get(
            "zipcode"
          ).value;
          this.signIn.data.city = this.createInformationForm.get("city").value;
          this.signIn.data.state = this.createInformationForm.get(
            "state"
          ).value;
          this.signIn.data.email = this.setPasswordForm.get("email").value;
          this.hideBack = true;
        } else {
          this.setPasswordForm.markAllAsTouched();
        }
        break;
      case 2:
        this.hideBack = false;
        this.role = this.typeID;
        this.createInformationForm.patchValue({
          email: this.setPasswordForm.value.email,
        });
        if(this.role){
        if (this.role == "AC-CAN" || this.role == "AC-TST") {
          this.getCommittee();
          this.showIEF = false;
          this.showCommitee = true;
          if (!this.showCommitteOrLobby && !this.showIEF) {
            this.hideNext = true;
          }
          this.selectIndex += 1;
        } else if (this.role == "AC-IEF") {
          this.getFiler(); 
          this.showIEF = true;
          this.showCommitee = false;
          this.selectIndex += 1;
        } else if (this.role == "AC-LOB") {
          this.getLobby();
          this.showIEF = false;
          this.showCommitee = false;
          if (!this.showCommitteOrLobby && !this.showIEF) {
            this.hideNext = true;
          }
          this.selectIndex += 1;
        } else if (this.role == "AC-CFE") {
          // this.showIEF = true;
          this.showTab = false;
          this.setData();
        }
      }else{
            this.hideBack = true;
        return this.snackbar.snackbarError(
                "Select atleast anyone user type",
                this.masterDate.centre
              );
      }

        //       }
        //     }
        //   },
        //   (error) => {
        //     this.hideBack = true;
        //     return this.snackbar.snackbarError(
        //       "Select atleast anyone user type",
        //       this.masterDate.centre
        //     );
        //   }
        // );
        // this.selectIndex += 1;
        break;
      case 3:
        this.signIn.data.occupation = this.independentExpenditureForm.get("occupation").value;
        this.signIn.data.employer = this.independentExpenditureForm.get("employer").value;
        this.signIn.data.organization = this.independentExpenditureForm.get("organization").value;
        this.setData();
        if (this.selectedCommLobbList.length == 0 && !this.showIEF) {
          return this.snackbar.snackbarError(
            "Select atleast any one",
            this.masterDate.centre
          );
        }else if(this.showIEF && this.independentExpenditureForm.valid || !this.showIEF){
          this.showTab = false;
        } else {
          this.independentExpenditureForm.markAllAsTouched();
          this.showTab = true;
        }
        this.hideBack = false;

        break;
    }
  }

  isSelected(index: number) {
    if (this.selectIndex == index) {
      return false;
    } else {
      return true;
    }
  }
  back() {
    if (this.selectedCommLobbList.length > 0 && !this.showTab) {
      this.showTab = true;
      this.showCommitteOrLobby = true;
      this.showIEF = false;
    } else if (this.selectedsel) {
      this.selectedsel = false;
      this.showCommitteOrLobby = !this.showCommitteOrLobby;
      this.hideNext = true;
      this.selectIndex = 3;
    } else if (!this.showTab && this.role != "AC-CFE") {
      this.showTab = true;
      this.selectIndex = 3;
    } else if (this.selectIndex == 0) {
      this.router.navigate(["/login"]);
    } else if (this.selectIndex == 3 && this.hideBack == false) {
      this.hideBack = true;
      this.hideNext = false;
      this.selectIndex -= 1;
    } else if (this.role == "AC-CFE" && !this.showTab) {
      this.selectIndex == 2;
      this.showTab = true;
      this.hideBack = true;
      this.hideNext = false;
    } else {
      this.selectIndex -= 1;
    }
  }

  confirmSubmit() {
    if (this.showIEF) {
      const ief = {
        contactId: this.contactInformationId,
        filerType: this.filerRole,
        occupation: this.independentExpenditureForm.value.occupation ? this.independentExpenditureForm.value.occupation.trim() : "",
        employer: this.independentExpenditureForm.value.employer ? this.independentExpenditureForm.value.employer.trim() : "",
        organisationName: this.independentExpenditureForm.value.organization ? this.independentExpenditureForm.value.organization.trim() : "",
      };
      this.service
        .postData(this.urlService.updateIef, ief)
        .subscribe((res: any) => {
          console.log(res);
          this.confirm = true;
        });
    }else if(this.role == "AC-CFE"){
      this.service
        .postData(this.urlService.createCoe + this.contactInformationId,{})
        .subscribe((res: any) => {
          console.log(res);
          this.confirm = true;
        });
    } else {
      if (this.showCommitee) {
        let selected: any = [];
        this.selectedCommLobbList.forEach((element: any) => {
          selected.push({ committeeID: element.committeeId });
        });
        const list = {
          contactID: this.contactInformationId,
          notes:"",
          committeeIds: selected,
        };
        this.service
          .postData(this.urlService.saveCommitteeAffiliation, list)
          .subscribe((res: any) => {
            console.log(res);
            this.confirm = true;
          });
      } else {
        let selected: any = [];
        this.selectedCommLobbList.forEach((element: any) => {
          selected.push({ refId: element.lobbyistID });
        });
        const list = {
          contactID: this.contactInformationId,
          notes:"",
          lobbyistIds: selected,
        };
        this.service
          .postData(this.urlService.saveLobbyistAffiliation, list)
          .subscribe((res: any) => {
            this.confirm = true;
            console.log(res);
          });
      }
    }
  }
  submit() {
    for (let user of this.getUserType) {
      if (this.typeID === user.lookUpTypeId) {
        this.confirmScreen.push(user.lookUpName);
      }
    }
    this.confirmSubmit();
  }
}
