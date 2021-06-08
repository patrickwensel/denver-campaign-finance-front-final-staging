import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
  selector: 'app-lobbyist-clients',
  templateUrl: './lobbyist-clients.component.html',
  styleUrls: ['./lobbyist-clients.component.scss'],
})
export class LobbyistClientsComponent implements OnInit {
  @Output() ClientDataEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() backBtnclientEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input() LobbyRegistrationDate:any =[];

  static_data: any;
  modal: any;
  organisation:any;
  business:any;
  legislative:any
  stateList: any;
  LobbyClientsForm: FormGroup;
  selectClient:any;
  editFormId: any;
  hideRequiredMarker: boolean = true;
  @Input() editable: boolean = false;
  txtQueryChanged: Subject<string> = new Subject<string>();
    @Output() addSearchEmitter: EventEmitter<any> = new EventEmitter<any>();
    SearchLobby: any;
  searchpopular: any;
  submitted:boolean;
  formedit:any;
  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    public dialog: MatDialog,
    public snackbar: SnackbarService,
    private service: ClientService,
    private urlService: MasterUrlService
  ) {
    this.txtQueryChanged.pipe(
      debounceTime(1000) ,// wait 1 sec after the last event before emitting last event
      distinctUntilChanged())// only emit if value is different from previous value
      .subscribe(model => {
        this.searchpopular = model;
    this.addSearchEmitter.emit(this.searchpopular);

      });

  }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.createClientsForm();
    this.getStateList();
    this.getSearchClients();
    // this.setClientList(this.LobbyRegistrationDate);
    // this.getSearchLobbyType();
    this.getLobbiestList();
    this.getClientListById();
  }
  // getSearchLobbyType() {
  //   this.service
  //     .postData(this.urlService.getLobbyID, { searchLobbyName: '' })
  //     .subscribe((res: any) => {
  //       this.SearchLobby = res;
  //       console.log(res);
  //     });
  // }

  getSearchLobbyType(){
    let params={
      lobbyistId:2
    }
    this.service.getWithData(this.urlService.getLobbyist,params ).subscribe((res: any) => {
          this.SearchLobby = res;
          console.log(res);
        });
  }
  setClientList(LobbyRegistrationDate: any) {
    let list = LobbyRegistrationDate?.clientInfo?.map((dat: any) => {
      let {
        client,
        firstName,
        phone,
        lastName,
        email,
        address1,
        address2,
        city,
        stateCode,
        zipCode,
        officialTitle,
        officialName,
        lobbyist,
        relationship,
        entityName,
        countryCode,
        orgName,
        BusinessName,
        remarks,
      } = dat;
      return {
        tenantId: 0,
        lobbyist,
        client,
        orgName,
        BusinessName,
        remarks,
        officialName,
        officialTitle,
        relationship,
        entityName,
        address1,
        address2,
        city,
        zipCode,
        stateCode,
        countryCode,
        firstName,
        lastName,
        phone,
        email,
      };
    });
    console.log(list);
    this.lobbyClientList.data = list;
  }
  ClientsLobby: string[] = [
    'organisationName',
    'lobbyist',
    'BusinessName',
    'remarks',
    'address1',
    'address2',
    'city',
    'state',
    'zipcode',
    'action',
  ];

  lobbyClientList = new MatTableDataSource();

  // dataSource = this.lobbyClients;
  SearchClients: any = [];

  getStateList() {
    this.stateList = [];
    this.service.getData(this.urlService.getLookUpStateList).subscribe((res: any) => {
      this.stateList = res;
      console.log(res);
    })
  }

  getSearchClients(event: any = {target:{value:''}}) {
    // const id = {
    //   searchClientName : this.selectClient ? this.selectClient : '',
    // }
    // this.service
    //   .postData(this.urlService.getClients, id)
    //   .subscribe((res: any) => {
    //     this.SearchClients = res;
    //     console.log(res);
    //   });
    let value = '';
    if (event)
      value = event.target.value;
let params={
  lobbyistId:this.LobbyRegistrationDate.lobbyistID,
roleType:"LOB-CLI",
searchName:value || '%'
}
    this.service.getWithData(this.urlService.getEmployeeLobbyistSearch, params).subscribe((res: any) => {
          this.SearchClients = res;
    })
  }

  getLobbiestList(){
  //   let params={
  //     lobbyistId:this.LobbyRegistrationDate.lobbyistID,
  //   roleType:"Lobbyist Client",
  //   searchName:'%'
  // }

  // api/Lobbyist/getLobbyistEntitiesbyName?lobbyistId=5&searchName=%&roleType=Lobbyist%20Client

    this.service.getData(`${this.urlService.getLobbiestById}${this.LobbyRegistrationDate.lobbyistID}`).subscribe((res: any) => {
      this.SearchLobby = res;
})
  }

  selectedItem(data: any) {
    console.log(data);
    this.createClientsForm(data);
  }

  createClientsForm(data: any = {}) {
    this.organisation = data.orgName;
    this.business = data.BusinessName;
    this.legislative = data.remarks;
    this.LobbyClientsForm = new FormGroup({
      contactId: new FormControl(data.contactId || null, []),
      client: new FormControl(data.client || null, []),

      organisationName: new FormControl(data.orgName || null, [
        Validators.required,
      ]),
      lobbyist: new FormControl(data.employeeId || null, [
        // Validators.minLength(2),
        // Validators.maxLength(120),
        // Validators.pattern(this.masterDate.onlyAlpha),
        Validators.required
      ]),
      BusinessName: new FormControl(data.natureOfBusiness || null, [
        Validators.minLength(2),
        Validators.maxLength(120),
      ]),
      remarks: new FormControl(data.legislativeMatters || null, [
        Validators.minLength(2),
        Validators.maxLength(120),
        // Validators.pattern(this.masterDate.onlyAlpha),
      ]),
      address1: new FormControl(data.address1 || null, [
        Validators.minLength(1),
        Validators.maxLength(150),
        Validators.pattern(this.masterDate.addressPattern),
      ]),
      address2: new FormControl(data.address2 || null, [
        Validators.minLength(1),
        Validators.maxLength(150),
      ]),
      zipCode: new FormControl(data.zipCode || null, []),
      city: new FormControl(data.city || null, []),
      stateCode: new FormControl(data.stateCode || null, []),
    });
  }
  validateClientForm() {
    if (this.LobbyClientsForm.valid) {
      const data = this.lobbyClientList.data;
      let {
        contactId,
        client,
        organisationName,
        lobbyist,
        BusinessName,
        remarks,
        address1,
        address2,
        zipCode,
        city,
        stateCode,
        typeOfUser
      } = this.LobbyClientsForm.value;
      this.modal = {
        contactId,
        client,
        organisationName,
        lobbyist,
        BusinessName,
        remarks,
        address1,
        address2,
        zipCode,
        stateCode,
        city,
        typeOfUser
      };

      this.saveClientModel();
    } else {
      this.LobbyClientsForm.markAllAsTouched();
    }
  }

  saveClientModel(){
    let {
      contactId,
      client,
      organisationName,
      lobbyist,
      BusinessName,
      remarks,
      address1,
      address2,
      zipCode,
      stateCode,
      city,
      typeOfUser,
    } =this.modal ;
    let modal = {
      "lobbyistEntityId": this.LobbyRegistrationDate.lobbyistID,
      "client": {
        "contactId": contactId || 0,
        "lobbyistClientId": 0, //lobbyist?parseInt(lobbyist):0,
        "companyName": organisationName || '',
        "employeeId": lobbyist?parseInt(lobbyist):0,
        "natureOfBusiness": BusinessName || '',
        "legislativeMatters": remarks || '',
        address1,
        address2,
        zipCode,
        stateCode,
        city,
      }
    }

    this.service.postData(this.urlService.saveClient,modal).subscribe((res:any) => {
      console.log(res);
      this.clearForm();
      if (this.formedit) {
        this.snackbar.snackbarSuccess("Client Updated Successfully");
        this.formedit = false;
      } else {
        this.snackbar.snackbarSuccess("Client Added Successfully");
      }
      this.getClientListById();
    })
  }
  getClientListById(){
    let params={
      lobbyistId:this.LobbyRegistrationDate.lobbyistID,
    roleType:"LOB-CLI"
    }
        this.service.getWithData(this.urlService.getEmployeeLobbyist, params).subscribe((res: any) => {
          this.lobbyClientList.data = res;
        })
  }
  clearForm() {
    this.editFormId = 0;
    this.LobbyClientsForm.reset();
  }

  editClients(data: any) {
    this.formedit = true;
    this.editFormId = data.id;
    this.createClientsForm(data);

  }
  validateSubmitClient() {
    if (this.LobbyClientsForm.dirty || this.LobbyClientsForm.valid) {
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

          if (this.lobbyClientList.data.length < 1) {
            return this.snackbar.snackbarError(
              'Minimum One Client is required',
              this.masterDate.centre
            );
          }
          // this.snackbar.snackbarSuccess('Client Details Added Successfully');
          this.ClientDataEmitter.emit(this.lobbyClientList.data);
        }
      });
    } else {

      if (this.lobbyClientList.data.length < 1) {
        return this.snackbar.snackbarError(
          'Minimum One Client is required',
          this.masterDate.centre
        );
      }
      // this.snackbar.snackbarSuccess('Client Details Added Successfully');
      this.ClientDataEmitter.emit(this.lobbyClientList.data);
    }



    // if (this.lobbyClientList.data.length < 1) {
    //   return this.snackbar.snackbarError(
    //     'Minimum One Client is required',
    //     this.masterDate.centre
    //   );
    // }
    // this.snackbar.snackbarSuccess('Client Details Added Successfully');
    // this.ClientDataEmitter.emit(this.lobbyClientList.data);
  }
  openConfirmationModal(id: any): void {
    if (this.lobbyClientList.data.length <= 1)
      return this.snackbar.snackbarError(
        'Lobbyist Should Have Atleast One Client',
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
        this.service.postData(`${this.urlService.deleteClient}${id}`,{}).subscribe((res: any) => {
          this.getClientListById();
          this.LobbyClientsForm.reset();
          this.formedit = false;
          return this.snackbar.snackbarSuccess('Client deleted successfully');
        })
      }
    });
  }
  goBack() {
    this.ClientDataEmitter.emit(this.lobbyClientList.data);
    if (this.LobbyClientsForm.dirty || this.LobbyClientsForm.valid) {
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
          this.backBtnclientEmitter.emit(3);
        }
      });
    } else {
      this.backBtnclientEmitter.emit(3);
    }
     this.backBtnclientEmitter.emit(3);
  }
  validateCancel() {
    this.clearForm();
    this.formedit = false;
  }
}
