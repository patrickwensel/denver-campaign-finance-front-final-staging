import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonMethods, ErrorMessageService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from "@angular/common";

@Component({
  selector: 'app-new-committee-approve-deny',
  templateUrl: './new-committee-approve-deny.component.html',
  styleUrls: ['./new-committee-approve-deny.component.scss']
})
export class NewCommitteeApproveDenyComponent implements OnInit, OnDestroy {

  static_data: any;
  addNoteForm:FormGroup;
  msgForm:FormGroup;
  committeeDetails:any;
  hideRequiredMarker: boolean = true;
  committeeId:any =0;
  updateStatus:any;
  addNoteValue:any;
  //addNote:any;
  sub: Subscription;
  id: any;
  type='string';
  comType = '';
  candidateLabels: any;
  bindItems: any;
  isActive : boolean = false;
  isNew : boolean = false;
  isDenied: boolean = false;

  constructor( public errorService: ErrorMessageService,
    private commonMethods: CommonMethods,
    private urlService: MasterUrlService,
    private service: ClientService,
    public snackbar: SnackbarService,
    private activeroute: ActivatedRoute,
    private changeDetectorRefs: ChangeDetectorRef,
    private location: Location,
    ) { }


  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this. createManageCommittee();
    this.MessageSendForm();
    this.sub = this.activeroute?.paramMap.subscribe(params => {
      console.log(params);
      this.id = params.get('id');
      this.committeeId= parseInt(this.id);
      this.getCommitteeInfoDetails();
    });
  }

  getCommitteeInfoDetails(){
    this.service.getData(this.urlService.getcommitteeDetails + this.id,).subscribe((res) => {
      let checkstatus = res.committeeDetail[0].status;
      console.log('fdsf==>>', checkstatus);
      if(checkstatus == 'NEW') {
        this.isNew = true;
      } else if(checkstatus == 'ACTIVE') {
        this.isActive = true;
      } else if(checkstatus == 'DENIED'|| checkstatus == 'TERMINATED') {
        this.isDenied = true;
      }
    })
  }

  getCommitteeType(e) {
    console.log(e);
    this.comType = e;
    console.log('add', this.candidateLabels);
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
      this.service.postData(this.urlService.updateCommitteeorLobbyistStatus,{
        "id": this.committeeId,
        "status": status,
        "notes": this.addNoteValue.addNote,
        "entityType": "C"
      }).subscribe((res:any) => {
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
        this.snackbar.snackbarSuccess(status?"Committee Details Approved Successfully":"Committee Details Deactivated Successfully");
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
      this.service.postData(this.urlService.updateCommitteeorLobbyistStatus,{
        "id": this.committeeId,
        "status": status,
        "notes": this.addNoteValue.addNote,
        "entityType": "C"
      }).subscribe((res:any) => {
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
      this.snackbar.snackbarSuccess(status?"Committee Details Activated  Successfully": "Committee Details Deactivated Successfully");
      this.addNoteForm.reset();
      })
    }
    else{
      this.snackbar.snackbarSuccess("Please add Note");
      this.addNoteForm.markAllAsTouched;
    }
  }

  // validateDeny(status){
  //   if(this.addNoteForm.valid){
  //     this.addNoteValue = this.addNoteForm.value;
  //     this.service.postData(this.urlService.updateCommitteeStatus +this.committeeId + '&status=' +status +'&notes='+this.addNoteValue.addNote,{}).subscribe((res:any) => {
  //       this.updateStatus = res;
  //       this.snackbar.snackbarSuccess("Committee Details Denied");
  //     })
  //   }
  //   else{
  //     this.addNoteForm.markAllAsTouched;
  //   }
  // }
  back(){
    this.location.back();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
