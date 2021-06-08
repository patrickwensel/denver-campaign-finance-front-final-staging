import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonMethods, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { Location } from "@angular/common";


@Component({
  selector: 'app-new-lobbyist-approve-deny',
  templateUrl: './new-lobbyist-approve-deny.component.html',
  styleUrls: ['./new-lobbyist-approve-deny.component.scss']
})
export class NewLobbyistApproveDenyComponent implements OnInit {
  static_data: any;
  sub: Subscription;
  addNoteForm:FormGroup;
  msgForm:FormGroup;
  id : any;
  getDetails: any;
  lobbyistId: number;
  show: any;
  getEmployee: any;
  getSubcontractor: any;
  getClients: any;
  getRelationships: any;
  getsignature: any;
  addNoteValue:any;
  updateStatus:any;
  isActive: boolean = false;
  lobbyId:any =0;
  isNew : boolean = false;
  isDenied: boolean = false;
  orgType: any;

  constructor(
    private commonMethods: CommonMethods,
    private activeroute: ActivatedRoute,
    private urlService: MasterUrlService,
    private service: ClientService,
    public snackbar: SnackbarService,
    private location: Location,

  ) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.sub = this.activeroute?.paramMap.subscribe(params => {
      console.log(params);
      this.id = params.get('id');
      this.lobbyId= parseInt(this.id);
    });
    //this.getLobbyistDetail();
    this.MessageSendForm();
    this.createManageCommittee();
    this.getLobbyDetails();
  }
// getLobbyistDetail(){
//   this.lobbyistId = 137
//   this.service.postData(this.urlService.lobbyListDetails + this.lobbyistId, {}).subscribe((res:any) => {
//     this.getDetails = res;
//     this.getEmployee = res.employees;
//     this.getSubcontractor = res.subContractors;
//     this.getClients = res.clients;
//     this.getRelationships = res.relationships;
//     this.getsignature = res.signature;
// });
// }


getLobbyDetails(){
  this.service.getData(this.urlService.lobbyistContactInformation + '?lobbyistId=' + this.id).subscribe((res) => {
    this.orgType = res.orgType;
    let checkstatus = res.statusCode;
    if(checkstatus == 'NEW') {
      this.isNew = true;
    } else if(checkstatus == 'ACTIVE') {
      this.isActive = true;
    } else if(checkstatus == 'DENIED' || checkstatus == 'TERMINATED') {
      this.isDenied = true;
    }
  })
}

createManageCommittee() {
  this.addNoteForm = new FormGroup({
    addNote: new FormControl('' || null,[Validators.required]),
  });
}
MessageSendForm(){
  this.msgForm = new FormGroup({
    subject: new FormControl('' || null,[Validators.required]),
    message: new FormControl('' || null, [Validators.required])
  })
}
validateApprove(status){
  if(this.addNoteForm.valid){
    this.addNoteValue = this.addNoteForm.value;
    this.service.postData(this.urlService.updateCommitteeorLobbyistStatus,{"id": this.lobbyId,"status": status,"notes": this.addNoteValue.addNote, "entityType": "L"}).subscribe((res:any) => {
      this.updateStatus = res;
      if(status == false) {
        this.isDenied = true;
        this.isActive = false;
        this.isNew = false;
      } else if(status = true) {
        this.isActive= true;
        this.isDenied = false;
        this.isNew = false;
      }
      this.snackbar.snackbarSuccess(status?"Lobbyist Details Approved Successfully":"Lobbyist Details Denied");
      this.addNoteForm.reset();
    })
  }
  else{
    this.snackbar.snackbarSuccess("Please add Note");
    this.addNoteForm.markAllAsTouched;
  }
}

deactivate(status){
  if(this.addNoteForm.valid){
    this.addNoteValue = this.addNoteForm.value;
    this.service.postData(this.urlService.updateCommitteeorLobbyistStatus,{"id": this.lobbyId,"status": status,"notes": this.addNoteValue.addNote, "entityType": "L"}).subscribe((res:any) => {
      this.updateStatus = res;
      if(status == false) {
        this.isDenied = true;
        this.isActive = false;
        this.isNew = false;
      } else if(status = true) {
        this.isActive= true;
        this.isDenied = false;
        this.isNew = false;
      }
      this.snackbar.snackbarSuccess(status?"Lobbyist Details Activated  Successfully": "Lobbyist Details Deactivated Successfully");
      this.addNoteForm.reset();
    })
  }
  else{
    this.snackbar.snackbarSuccess("Please add Note");
    this.addNoteForm.markAllAsTouched;
  }
}
back(){
  this.location.back();
}

}
