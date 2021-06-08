import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  CommonMethods,
  ErrorMessageService,
  MasterDataService,
  MasterUrlService,
  SnackbarService,
} from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { Location } from "@angular/common";
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-lobbyist-employees',
  templateUrl: './lobbyist-employees.component.html',
  styleUrls: ['./lobbyist-employees.component.scss'],
})
export class LobbyistEmployeesComponent implements OnInit {
  @Output() EmployeeeDataEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() backBtnEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input() LobbyRegistrationDate: any = {};

  static_data: any;
  LobbyEmployeesForm: FormGroup;
  editFormId: any;
  modal: any = {};
  SearchLobby: any = [];
  hideRequiredMarker: boolean = true;
  formedit: boolean;
  contactId: number;

  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    public snackbar: SnackbarService,
    public dialog: MatDialog,
    private service: ClientService,
    private urlService: MasterUrlService,
    private location: Location,
    public route : ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.LobbyEmployees();
    this.getEMPListById();
    this.getSearchLobbyType();
    this.setEmployeeList(this.LobbyRegistrationDate);

    this.route?.queryParams.subscribe((params:any) => {

      this.contactId = +params['contactId'];

   });
  }
  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  
  getEMPListById() {
    let params={
      lobbyistId:this.LobbyRegistrationDate.lobbyistID,
    roleType:"LOB-EMP"
    }
        this.service.getWithData(this.urlService.getEmployeeLobbyist, params).subscribe((res: any) => {
          this.lobbyEmployeeList.data = res;
        })
  }
  EmployeeLobby: string[] = [
    'firstName',
    'lastName',
    'phone',
    'email',
    'action',
  ];
  lobbyEmployeeList = new MatTableDataSource();
  setEmployeeList(LobbyRegistrationDate: any) {
    let list = LobbyRegistrationDate ?.employeeInfo ?.map((dat: any) => {
      let {
        userId,
        firstName,
        phoneNo,
        lastName,
        emailId,
        address1,
        address2,
        city,
        stateCode,
        zipcode,
        organisationName,
        occupation,
        lobbyistId,
      } = dat;
      return {
        tenantId: 0,
        userId,
        firstName,
        lastName,
        address1,
        address2,
        city,
        state: stateCode,
        zipcode,
        countryCode: '',
        emailId,
        phoneNo,
        organisationName,
        occupation,
        lobbyistId,
      };
    });
    console.log(list);
    this.lobbyEmployeeList.data = list;
  }

  getSearchLobbyType(event: any = null) {
    let value = '';
    if (event)
      value = event.target.value;
let params={
  lobbyistId:this.LobbyRegistrationDate.lobbyistID,
roleType:"LOB-EMP",
searchName:value || '%'
}
    this.service.getWithData(this.urlService.getEmployeeLobbyistSearch, params).subscribe((res: any) => {
      this.SearchLobby = res;
    })
  }

  selectedItem(data: any) {
    console.log(data);
    this.LobbyEmployees(data);
  }

  LobbyEmployees(data: any = {}) {
    this.LobbyEmployeesForm = new FormGroup({
      contactID: new FormControl(data.contactID || '',
      []),
      lobbyist: new FormControl(data.type || null, []),
      contactId: new FormControl(data.contactId || null, []),
      firstName: new FormControl(data.firstName || null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(80),
        Validators.pattern(this.masterDate.onlyAlpha),
      ]),
      lastName: new FormControl(data.lastName || null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(80),
        Validators.pattern(this.masterDate.onlyAlpha),
      ]),
      phoneNo: new FormControl(data.phoneNo || null, [
        Validators.maxLength(10),
        Validators.pattern(this.masterDate.phoneNumerhipenvalidation),
      ]),
      emailId: new FormControl(data.emailId || null, [
        Validators.pattern(this.masterDate.emailValidations),
      ]),
    });
  }
  ValidateEmployeeForm() {
    if (this.LobbyEmployeesForm.valid) {
      const data = this.lobbyEmployeeList.data;
      let {
        lobbyist,
        firstName,
        lastName,
        phoneNo,
        emailId,
        contactId,
      } = this.LobbyEmployeesForm.value;
      if (this.checkEmailAlreadyExist(emailId)) {
        return this.snackbar.snackbarError(
          'Employee Email Already Exist',
          this.masterDate.centre
        );
      }
      this.modal = {
        lobbyist,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNo,
        emailId,
        contactId,
      };
      if (!this.editFormId) {
        this.modal.id = data.length + 1;
      } else {
        // update
        let findI = data.findIndex((fd: any) => fd.id == this.editFormId);
        if (findI != -1) {
          data.splice(findI, 1);
        }
        this.modal.id = this.editFormId;
        this.editFormId = 0;
      }
      data.push(this.modal);
      this.getSearchLobbyType();
      this.lobbyEmployeeList.data = data;

      //  const employee = {
      //     "lobbyistEntityId": 0,
      //     "employee": {
      //       "contactId": 0,
      //       "firstName": this.modal.firstName,
      //       "middleName": "",
      //       "lastName": this.modal.lastName,
      //       "phoneNo": this.modal.phone,
      //       "emailId": this.modal.email
      //   }
      // }
      // this.service.postData(this.urlService.saveEmployee,employee).subscribe((res:any) => {
      //   console.log(res);
      // })

      this.saveEmployee();
      if (this.formedit) {
        this.snackbar.snackbarSuccess('Employee Updated Successfully');
        this.formedit = false;
      } else {
        this.snackbar.snackbarSuccess('Employee Added Successfully');
      }
      this.clearForm();
      this.getSearchLobbyType();
    } else {
      this.LobbyEmployeesForm.markAllAsTouched();
      this.getSearchLobbyType();
    }
  }
  saveEmployee(){
    const employee = {
      "lobbyistEntityId": this.LobbyRegistrationDate.lobbyistID || 0,
      "employee": {
        "contactId": this.modal.contactId || 0, //this.contactId
        "firstName": this.modal.firstName,
        "middleName": "",
        "lastName": this.modal.lastName,
        "phoneNo": this.modal.phoneNo,
        "emailId": this.modal.emailId,
    }
  }
  this.service.postData(this.urlService.saveEmployee,employee).subscribe((res:any) => {
    console.log(res);
    this.getEMPListById();
  })
  }
  clearForm() {
    this.editFormId = 0;
    this.LobbyEmployeesForm.reset();
    console.log(this.LobbyEmployeesForm.controls)
  }
  checkEmailAlreadyExist(email: string) {
    if (this.editFormId) return false;

    let exist = this.lobbyEmployeeList.data.findIndex(
      (d: any) => d.email == email
    );
    return !(exist === -1);
  }
  editEmployee(data: any) {
    this.formedit = true;
    this.editFormId = data.id;
    this.LobbyEmployees(data);
  }
  openConfirmationModal(id: any): void {
    if (this.lobbyEmployeeList.data.length <= 1)
      return this.snackbar.snackbarError(
        'Lobbyist Should Have Atleast One Employee',
        this.masterDate.centre
      );

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
          this.getEMPListById();
          this.LobbyEmployeesForm.reset();
          this.formedit = false;
          return this.snackbar.snackbarSuccess('Employee deleted successfully');
        })
      }
    });
  }
  validateSubmitEmployee() {

    if (this.LobbyEmployeesForm.dirty || this.LobbyEmployeesForm.valid) {
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

          if (this.lobbyEmployeeList.data.length < 1) {
            return this.snackbar.snackbarError(
              'Minimum One Employee is required',
              this.masterDate.centre
            );
          }
          if (this.formedit) {
            // this.snackbar.snackbarSuccess('Employee Details updated Successfully');
            this.formedit = false;
          } else {
            // this.snackbar.snackbarSuccess('Employee Details Added Successfully');
          }

          this.EmployeeeDataEmitter.emit(this.lobbyEmployeeList.data);
          this.setEmployeeList(this.LobbyRegistrationDate);
        }
      });
    } else {
      if (this.lobbyEmployeeList.data.length < 1) {
        return this.snackbar.snackbarError(
          'Minimum One Employee is required',
          this.masterDate.centre
        );
      }
      // this.snackbar.snackbarSuccess('Employee Details Added Successfully');
      this.EmployeeeDataEmitter.emit(this.lobbyEmployeeList.data);
      this.setEmployeeList(this.LobbyRegistrationDate);
    }


  }
  goBack() {
    this.EmployeeeDataEmitter.emit(this.lobbyEmployeeList.data);
    this.setEmployeeList(this.LobbyRegistrationDate);
    if (this.LobbyEmployeesForm.dirty || this.LobbyEmployeesForm.valid) {
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
          this.backBtnEmitter.emit(1);
        }
      });
    } else {
      this.backBtnEmitter.emit(1);
    }


    this.backBtnEmitter.emit(1);
  }

  validateCancel() {
    this.clearForm();
    this.formedit = false;
  }
}
