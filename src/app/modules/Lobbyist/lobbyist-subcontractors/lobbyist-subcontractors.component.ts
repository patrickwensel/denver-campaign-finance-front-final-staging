import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {
  CommonMethods,
  ErrorMessageService,
  MasterDataService,
  MasterUrlService,
  SnackbarService,
} from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-lobbyist-subcontractors',
  templateUrl: './lobbyist-subcontractors.component.html',
  styleUrls: ['./lobbyist-subcontractors.component.scss'],
})
export class LobbyistSubcontractorsComponent implements OnInit {
  @Output() subcontractorDataEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() backBtnEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input() LobbyRegistrationDate:any = {}
  dataSource = new MatTableDataSource<any>([]);
  static_data: any;
  modal: any = {};
  editFormId: any;
  LobbySubcontractorsForm: FormGroup;
  SearchControl = new FormControl();
  hideRequiredMarker: boolean = true;
  formedit:any;
  contactId: number;
  subContractorType: any;
  SearchSubContractor: any = [];
  saveDisable: boolean = false;
  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    public dialog: MatDialog,
    public snackbar: SnackbarService,
    private service: ClientService,
    private urlService: MasterUrlService,
    public route : ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route?.queryParams.subscribe((params:any) => {
      this.contactId = +params['contactId']; 

   });
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();

    this.createSubcontractorsForm();
    // this.setSubcontractorList(this.LobbyRegistrationDate);
    this.getLobbySubcontractorListById();
    this.getSubContractorType();
  }

  selectedItem(data: any) {
    console.log(data);
    this.createSubcontractorsForm(data);
  }

  getSearchSubContractor(event: any = { target: { value: '' } }) {

    let value = '';
    if (event)
      value = event.target.value;
    let params = {
      lobbyistId: this.LobbyRegistrationDate.lobbyistID,
      roleType: "LOB-SUB",
      searchName: value || '%'
    }
    this.service.getWithData(this.urlService.getEmployeeLobbyistSearch, params).subscribe((res: any) => {
      this.SearchSubContractor = res;
    })
  }

  getSubContractorType(){
this.service.getData(`${this.urlService.getLookUpTypeList}LOB_TYPE`).subscribe((res: any) => {
  this.subContractorType = res;
})
  }

  getLobbySubcontractorListById() {
    let params = {
      lobbyistId: this.LobbyRegistrationDate.lobbyistID,
      roleType: "LOB-SUB"
    }
    this.service.getWithData(this.urlService.getEmployeeLobbyist, params).subscribe((res: any) => {
      this.lobbySubcontractorList.data = res;
    })
  }
  setSubcontractorList(LobbyRegistrationDate: any){
    let list =LobbyRegistrationDate.subContractorInfo?.map((dat:any)=>{
      let { type,first, phone, last, email, address1, address2, city, stateCode, zipcode, subcontractorName, occupation, countryCode } = dat;
      return  {
        "tenantId": 0,
        type,
        subcontractorName,
        phone,
        email,
        address1,
        address2,
        stateCode,
        city,
        zipcode,
        countryCode,
        first,
        last
        }
    })
    console.log(list)
    this.lobbySubcontractorList.data = list;
  }
  SubcontractorLobby: string[] = [
    'type',
    'subcontractorName',
    'first',
    'last',
    'phone',
    'email',
    'action',
  ];
  lobbySubcontractorList = new MatTableDataSource();

  createSubcontractorsForm(data: any = {}) {
    this.LobbySubcontractorsForm = new FormGroup({
      subContract:new FormControl( '', []),
      contactId: new FormControl(data.contactId || null, []),
      type: new FormControl(data.contactType || null, [Validators.required]),
      first: new FormControl(data.firstName || null,[Validators.required]),
      last: new FormControl(data.lastName || null,[Validators.required]),
      subcontractorName: new FormControl(data.fullName || null, [
         Validators.pattern(this.masterDate.onlyAlpha)
      ]),
      phone: new FormControl(data.phoneNo || null, [
        Validators.maxLength(10),
        Validators.pattern(this.masterDate.phoneNumerhipenvalidation),
      ]),
      email: new FormControl(data.emailId || null, [
        Validators.pattern(this.masterDate.emailValidations),
      ]),
    });
  }

  customValidator() {
    if(this.LobbySubcontractorsForm.value.type == 'LOB-I') {
      this.LobbySubcontractorsForm.controls['first'].setValidators([Validators.required]),
      this.LobbySubcontractorsForm.controls['first'].updateValueAndValidity()
      this.LobbySubcontractorsForm.controls['last'].setValidators([Validators.required]),
      this.LobbySubcontractorsForm.controls['last'].updateValueAndValidity()
      this.LobbySubcontractorsForm.controls['subcontractorName'].clearValidators(),
      this.LobbySubcontractorsForm.controls['subcontractorName'].setErrors(null)
    } else {
      this.LobbySubcontractorsForm.controls['subcontractorName'].setValidators([Validators.required]),
      this.LobbySubcontractorsForm.controls['first'].clearValidators()
      this.LobbySubcontractorsForm.controls['last'].clearValidators()
      this.LobbySubcontractorsForm.controls['first'].setErrors(null)
      this.LobbySubcontractorsForm.controls['last'].setErrors(null)

    }
  }

  // Validate Save Button
  ValidateSubcontractorForm() {
    this.saveDisable = true;
    try{
    if (this.LobbySubcontractorsForm.valid) {
      const data = this.lobbySubcontractorList.data;
      let {
        contactId,
        type,
        subcontractorName,
        phone,
        email,
        first,
        last
      } = this.LobbySubcontractorsForm.value;
      if (this.checkEmailAlreadyExist(email)) {
        return this.snackbar.snackbarError(
          'Subcontractor Email Already Exist',
          this.masterDate.centre
        );
      }
      this.modal = {
        type,
        subcontractorName: subcontractorName && subcontractorName.trim(),
        phone,
        email,
        first,
        last,
        contactId
      };
      // if (!this.editFormId) {
      //   this.modal.id = data.length + 1;
      // } else {
      //   // update
      //   let findI = data.findIndex((fd: any) => fd.id == this.editFormId);
      //   if (findI != -1) {
      //     data.splice(findI, 1);
      //   }
      //   this.modal.id = this.editFormId;
      //   this.editFormId = 0;
      // }
      // data.push(this.modal);
      // this.lobbySubcontractorList.data = data;
      this.savesubcontractor();
     
    } else {
      this.LobbySubcontractorsForm.markAllAsTouched();
      this.saveDisable = false;
    }
  } catch(err){
    this.saveDisable = false;
  }
  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  savesubcontractor(){
    let name = this.modal.first;
    if(this.modal.type == 'LOB-O'){
      name = this.modal.subcontractorName || '';
    }
    const subcontractor = {
        "lobbyistEntityId": this.LobbyRegistrationDate.lobbyistID,
        "subcontractor": {
          "contactId": this.modal.contactId || 0,
          "typeId": this.modal.type,
          "firstName": name || '',
          "middleName": "",
          "lastName": this.modal.last || '',
          "phoneNo": this.modal.phone || '',
          "emailId": this.modal.email || ''
      }
    }

  this.service.postData(this.urlService.saveSubcontractor,subcontractor).subscribe((res:any) => {
    // console.log(res);
    this.getLobbySubcontractorListById();
    if (this.formedit) {
      this.snackbar.snackbarSuccess("Subcontractor Updated Successfully");
      this.formedit = false;
    } else {
      this.snackbar.snackbarSuccess("SubContractor Added Successfully");
    }
    this.saveDisable = false;

    this.clearForm();
  }, err =>{
    this.saveDisable = false;
  })
  }

  // clearForm
  clearForm() {
    this.editFormId = 0;
    this.LobbySubcontractorsForm.reset();
  }

  // EmailCheck
  checkEmailAlreadyExist(email: string) {
    if (this.editFormId) return false;

    let exist = this.lobbySubcontractorList.data.findIndex(
      (d: any) => d.email == email
    );
    return !(exist === -1);
  }

  // edit
  editSubcontractor(data: any) {
    this.formedit = true;
    this.editFormId = data.id;
    this.createSubcontractorsForm(data);
  }

  // Delete
  openConfirmationModal(id: any): void {

    // if (this.lobbySubcontractorList.data.length <= 1)
    // return this.snackbar.snackbarError('Lobbyist Should Have Atleast One Subcontractor', this.masterDate.centre);


    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '450px',
      height: '180px',
      data: {
        id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'close') {
        this.service.postData(`${this.urlService.deleteEmployee}${id}`,{}).subscribe((res: any) => {
          this.getLobbySubcontractorListById();
          this.LobbySubcontractorsForm.reset();
          this.formedit = false;
          return this.snackbar.snackbarSuccess('Subcontractor deleted successfully');
        })
      }
    });
  }

  ValidateSubmitSubContractor() {
    // if (this.lobbySubcontractorList.data.length < 1) {
    //   return this.snackbar.snackbarError(
    //     'Minimum One Subcontractor is required',
    //     this.masterDate.centre
    //   );
    // }

    if (this.LobbySubcontractorsForm.dirty || this.LobbySubcontractorsForm.valid) {
      const options = {
        title: "Alert",
        message: "Are you sure you want to proceed without saving the changes?",
        cancelText: "Cancel",
        confirmText: "YES",
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
          this.subcontractorDataEmitter.emit(this.lobbySubcontractorList.data);
    if (this.lobbySubcontractorList.data.length >= 1) {
      if (this.formedit) {
        // this.snackbar.snackbarSuccess("Subcontractor Details Updated Successfully");
        this.formedit = false;
      } else {
        // this.snackbar.snackbarSuccess("Subcontractor Details Added Successfully");
      }

  }
        }
      });
    } else {
      this.subcontractorDataEmitter.emit(this.lobbySubcontractorList.data);
      if (this.lobbySubcontractorList.data.length >= 1) {
      this.snackbar.snackbarSuccess("Subcontractor Details Added Successfully");
    }
    }

    // this.subcontractorDataEmitter.emit(this.lobbySubcontractorList.data);
    // if (this.lobbySubcontractorList.data.length >= 1) {
    // this.snackbar.snackbarSuccess("Subcontractor Details Added Successfully");
  // }
}

  goBack(){
    // this.backBtnEmitter.emit(2)
    this.subcontractorDataEmitter.emit(this.lobbySubcontractorList.data);

    if (this.LobbySubcontractorsForm.dirty || this.LobbySubcontractorsForm.valid) {
      const options = {
        title: "Alert",
        message: "Are you sure you want to proceed without saving the changes?",
        cancelText: "Cancel",
        confirmText: "YES",
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
          this.backBtnEmitter.emit(2);
        }
      });
    } else {
      this.backBtnEmitter.emit(2);
    }
    this.backBtnEmitter.emit(2);
  }
  validateCancel(){
    this.clearForm();
    this.formedit = false;
  }
}
