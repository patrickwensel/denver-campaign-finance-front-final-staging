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

const lobbyRelationship = [
  {
    lobbyist: 'Lorem Ipsum',
    officialName: 'Lorem Ipsum',
    officialTitle: 'Lorem Ipsum',
    relationship: 'Lorem Ipsum',
    entityName: 'Lorem Ipsum',
  },
];

@Component({
  selector: 'app-lobbyist-relationships',
  templateUrl: './lobbyist-relationships.component.html',
  styleUrls: ['./lobbyist-relationships.component.scss'],
})
export class LobbyistRelationshipsComponent implements OnInit {
  @Output()
  RelationshipDataEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() backBtnEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input() LobbyRegistrationDate:any = {}
  static_data: any;
  LobbyRelationshipForm: FormGroup;
  editFormId: any;
  modal: any;
  hideRequiredMarker: boolean = true;
  lobbyist:'Lobbyist 1';
  SearchLobby:any;
  formedit:any;
  SearchRelationship: any = [];
  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    public snackbar: SnackbarService,
    public dialog: MatDialog,
    private service: ClientService,
    private urlService: MasterUrlService
  ) {}

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();

    this.createRelationshipForm();
    // this.setRelationList(this.LobbyRegistrationDate);
    this.getSearchLobbyType();
    this.getLobbiestRelationListById();
  }

  selectedItem(data: any) {
    console.log(data);
    this.createRelationshipForm(data);
  }

  getSearchRelationship(event: any = { target: { value: '' } }) {

    let value = '';
    if (event)
      value = event.target.value;
    let params = {
      lobbyistId: this.LobbyRegistrationDate.lobbyistID,
      roleType: "LOB-REL",
      searchName: value || '%'
    }
    this.service.getWithData(this.urlService.getEmployeeLobbyistSearch, params).subscribe((res: any) => {
      this.SearchRelationship = res;
    })
  }
  getLobbiestRelationListById() {
    let params = {
      lobbyistId: this.LobbyRegistrationDate.lobbyistID,
      roleType: "LOB-REL"
    }
    this.service.getWithData(this.urlService.getEmployeeLobbyist, params).subscribe((res: any) => {
      this.lobbyRelationshipList.data = res;
    })
  }
  getSearchLobbyType() {
    // this.service
    //   .postData(this.urlService.getLobbyID, { searchLobbyName: '' })
    //   .subscribe((res: any) => {
    //     this.SearchLobby = res;
    //     console.log(res);
    //   });
    this.service.getData(`${this.urlService.getLobbiestById}${this.LobbyRegistrationDate.lobbyistID}`).subscribe((res: any) => {
      this.SearchLobby = res;
    })
  }
  setRelationList(LobbyRegistrationDate: any){
    let list =LobbyRegistrationDate.relationship?.map((dat:any)=>{
      let { userId,firstName, phone, lastName, email, address1, address2, city, stateCode, zipcode, officialTitle, officialName, lobbyist,relationship,entityName,countryCode } = dat;
      return  {
        "tenantId": 0,
         lobbyist,
          officialName,
          officialTitle,
          relationship,
          entityName,
          address1,
          address2,
          city,
          zipcode,
          stateCode,
          countryCode,
          firstName,
          lastName,
          phone,
          email
        }
    })
    console.log(list)
    this.lobbyRelationshipList.data = list;
  }
  RelationshipLobby: string[] = [
    'lobbyist',
    'officialName',
    'officialTitle',
    'relationship',
    'entityName',
    'action',
  ];
  lobbyRelationshipList = new MatTableDataSource();

  createRelationshipForm(data: any = {}) {
    this.LobbyRelationshipForm = new FormGroup({
      relationshipSearch:new FormControl('', []),
      contactId: new FormControl(data.contactId || null, []),
      lobbyist: new FormControl(data.lobbysitId || data.employeeId || null, [Validators.required]),
      officialName: new FormControl(data.officialName || null, [
        Validators.maxLength(100)
      ]),
      officialTitle: new FormControl(data.officialTitle || null, [
        Validators.maxLength(100)
      ]),
      relationship: new FormControl(data.relationship || null, [
        Validators.maxLength(100)
      ]),
      entityName: new FormControl(data.entityName || null, [
        Validators.maxLength(100)
      ]),
    });
  }
  ValidateEmployeeForm() {
    if (this.LobbyRelationshipForm.valid) {
      const data = this.lobbyRelationshipList.data;
      let {
        lobbyist,
        officialName,
        officialTitle,
        relationship,
        entityName,
        contactId
      } = this.LobbyRelationshipForm.value;
      this.modal = {
        lobbyist,
        officialName: officialName.trim(),
        officialTitle: officialTitle.trim(),
        relationship,
        entityName,
        contactId
      };

      this.saveRelationShip();
    } else {
      this.LobbyRelationshipForm.markAllAsTouched();
    }
  }

  saveRelationShip(){
    let  {
      lobbyist,
      officialName,
      officialTitle,
      relationship,
      entityName,
      contactId
    } = this.modal ;
    let modal ={
      "lobbyistEntityId": this.LobbyRegistrationDate.lobbyistID,
      "relationship": {
        "contactId": contactId || 0,
        "relationshipId": 0,
        "employeeId": lobbyist?parseInt(lobbyist):0,
        "officeName": officialName,
        "officeTitle": officialTitle,
        "relationshipDesc": relationship,
        "entityName": entityName,
        "lobbyistClientId": 0
      }
    }
    this.service.postData(this.urlService.saveRelationship,modal).subscribe((res:any) => {
      console.log(res);
      this.clearForm();
      if (this.formedit) {
        this.snackbar.snackbarSuccess("Relationship Updated Successfully");
        this.formedit = false;
      } else {
        this.snackbar.snackbarSuccess("Relationship Added Successfully");
      }
      this.getLobbiestRelationListById();
    })
  }
  clearForm() {
    this.editFormId = 0;
    this.LobbyRelationshipForm.reset();
  }
  editRelationships(data: any) {
    this.formedit=true;
    this.editFormId = data.id;
    this.createRelationshipForm(data);
  }
  openConfirmationModal(id: any): void {

    if (this.lobbyRelationshipList.data.length <= 1)
    return this.snackbar.snackbarError('Lobbyist Should Have Atleast One Relationship', this.masterDate.centre);


    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '450px',
      height: '180px',
      data: {
        id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'close') {
        // this.snackbar.snackbarSuccess('Relationship deleted successfully');
        // const data = this.lobbyRelationshipList.data;
        // let findI = data.findIndex((fd: any) => fd.id == result);
        // if (findI != -1) {
        //   data.splice(findI, 1);
        // }
        // this.lobbyRelationshipList.data = data;
        this.service.postData(`${this.urlService.deleteRelationship}${id}`,{}).subscribe((res: any) => {
          this.getLobbiestRelationListById();
          this.LobbyRelationshipForm.reset();
          this.formedit = false;
          return this.snackbar.snackbarSuccess('Relationship deleted successfully');
        })
      }
    });
  }
  SubmitRelationshipForm() {

    if (this.LobbyRelationshipForm.dirty || this.LobbyRelationshipForm.valid) {
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
          this.RelationshipDataEmitter.emit(this.lobbyRelationshipList.data);
          if (this.lobbyRelationshipList.data.length >= 1) {
            // this.snackbar.snackbarSuccess("Relationship Details Added Successfully");
          }
        }
      });
    } else {
      this.RelationshipDataEmitter.emit(this.lobbyRelationshipList.data);
      if (this.lobbyRelationshipList.data.length >= 1) {
        // this.snackbar.snackbarSuccess("Relationship Details Added Successfully");
      }
    }
    // if (this.lobbyRelationshipList.data.length < 1) {
    //   return this.snackbar.snackbarError(
    //     'Minimum One Relationship is required',
    //     this.masterDate.centre
    //   );
    // }
    // this.RelationshipDataEmitter.emit(this.lobbyRelationshipList.data);
    // if (this.lobbyRelationshipList.data.length >= 1) {
      // this.snackbar.snackbarSuccess("Relationship Details Added Successfully");
    // }
  }
  goBack(){
    this.RelationshipDataEmitter.emit(this.lobbyRelationshipList.data);
    if (this.LobbyRelationshipForm.dirty || this.LobbyRelationshipForm.valid) {
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
          this.backBtnEmitter.emit(3);
        }
      });
    } else {
      this.backBtnEmitter.emit(3);
    }
     this.backBtnEmitter.emit(3)
  }
  validateCancel(){
    this.clearForm();
    this.formedit = false;
  }
}
