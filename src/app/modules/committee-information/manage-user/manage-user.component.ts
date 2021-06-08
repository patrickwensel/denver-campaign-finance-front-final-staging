import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LocalstorageService, CommonMethods, MasterDataService, MasterUrlService, ErrorMessageService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { MakeTreasurerPopUpComponent } from "src/app/shared/components/make-treasurer-pop-up/make-treasurer-pop-up.component";
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  static_data: any = {
    "manage_users": {
      "heading": {
        "manage_usr": "Manage Users",
        "current_user": "Current Users",
        "affiliation_request": "Affiliation Request",
        "affiliation_message": "These users have requested to access to this committee. Approved by clicking the check mark, Making that user an Officer the the committee. Denythe request by clicking the 'x'",
        "make_treasurer": "Make Teasurer"
      },
      "table_th": {
        "role": "Roll",
        "f_name": "First Name",
        "l_name": "Last Name",
        "username": "Username(Email)",
        "permission": "Permissions",
        "action": "Action"
      },
      "table_th_affiliation": {
        "f_name": "First Name",
        "l_name": "Last Name",
        "username": "Username(Email)",
        "request_note": "Request Note",
        "action": "Action"
      },
      "add_user": {
        "message": "Send a committee user request access to join this committee.",
        "head": "Add User",
        "label": "Email Address",
        "send_btn": "Send"
      },
      "popup_msg": {
        "p_1": "Are you sure you want to make {{data.name}} Treasure of this committee?",
        "p_2": "Clicking 'Yes' will send {{data.name}} a notification to confirm this change. If confirmed within 48 hours, Your account will be changed to an officer account, and you will no longer be able to access this page or change your account back to Treasure",
        "p_3": "Are you sure you want to proceed?"
      }
    }
  };
  name = 'Jon Rios for City Council';
  hideRequiredMarker = true;

  ELEMENT_DATA: any = [
    { position: '1234', name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: '4321', name: 'Helium', weight: 4.0026, symbol: 'He' },
  ];

  displayedColumns: string[] = ['invoice_number', 'type', 'description',
    'date', 'amount', 'view_atch', 'view_invoice'];
  displayedColumnCurrentUsers: string[] = ['role', 'firstName', 'lastName',
    'username', 'permissions', 'action'];
  dataSource: any = [];
  currentUsers: any = [];
  emailForm: FormGroup;
  filerType: any;
  filerCommitteeId: any;
  committeeInformation: any;

  constructor(
    private localStore: LocalstorageService,
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    private urlService: MasterUrlService,
    public errorService: ErrorMessageService,
    private service: ClientService,
    public dialog: MatDialog,
    public snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.dataSource = this.ELEMENT_DATA;
    this.filerType = this.localStore.getLocalStorage('user_chosen');
    this.filerCommitteeId = this.localStore.getLocalStorage('choosen_id');
    this.InformationForm({});
    if (!this.filerType || !this.filerCommitteeId) {
      // No Committee is chossen in swith committee

    } else {

      this.getCurrentUserList(this.filerCommitteeId, this.urlService.CurrentUserList, (this.filerType == "committee" ? 'C' : this.filerType == "lobbyist" ? 'L' : 'IE'));
    }
  }

  getCurrentUserList(id, url, type) {
    this.service.getData(url + '?entityId=' + id + '&entityType=' + type).subscribe((res) => {
      this.currentUsers = res;
    })
  }
  InformationForm(data: any) {
    this.emailForm = new FormGroup({
      email: new FormControl(data.email || null,[Validators.required, Validators.maxLength(120), Validators.pattern(this.masterDate.emailValidations)]),
    });
  }

  addOrInviteUser(){
    debugger;
    if(this.emailForm.valid){
   let detail = {
      "emailId": this.emailForm.value.email,
      "entity_id": this.filerCommitteeId,
      "entity_Type": (this.filerType == "committee" ? 'C' : this.filerType == "lobbyist" ? 'L' : 'IE')
    }

    this.service.postData(this.urlService.addCurrentUser,detail).subscribe((res) => {
      this.getCurrentUserList(this.filerCommitteeId, this.urlService.CurrentUserList, (this.filerType == "committee" ? 'C' : this.filerType == "lobbyist" ? 'L' : 'IE'));
      return this.snackbar.snackbarSuccess("User Invited Succesfully" || res.message);
    })
  }
  }

  openConfirmationModal(data: any): void {

    const dialogRef = this.dialog.open(MakeTreasurerPopUpComponent, {
      width: "460px",
      data: { id: data.contactID }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== "close") {
        let dataReq = {
          "contactID": data.contactID,
          "userID": data.userID,
          "status": "",
          "entityId": this.filerCommitteeId,
          "entityType": (this.filerType == "committee" ? 'C' : this.filerType == "lobbyist" ? 'L' : 'IE'),
          "emailMsgID": 0
        }
        this.service.postData(this.urlService.makeUserTreasurer, dataReq).subscribe((res) => {
          this.getCurrentUserList(this.filerCommitteeId, this.urlService.CurrentUserList, (this.filerType == "committee" ? 'C' : this.filerType == "lobbyist" ? 'L' : 'IE'));
          this.snackbar.snackbarSuccess("Treasurer role updated for this user successfully");
        }, err => {
          console.log(err);
          this.snackbar.snackbarSuccess(this.masterDate.errorMsg);
        })
      }
    });
  }

  openDeleteConfirmationModal(data: any): void {

    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: "460px",
      data: { id: data.contactID }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== "close") {
        this.service.delete(this.urlService.deleteCurrentUser + '?contactId=' + data.contactID + '&filerId=' + data.filerID).subscribe((res) => {
          this.getCurrentUserList(this.filerCommitteeId, this.urlService.CurrentUserList, (this.filerType == "committee" ? 'C' : this.filerType == "lobbyist" ? 'L' : 'IE'));
        })
      }
    });
  }

}
