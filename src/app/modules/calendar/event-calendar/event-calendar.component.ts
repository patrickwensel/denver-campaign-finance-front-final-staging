import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CommonMethods, ErrorMessageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { Location } from "@angular/common";
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import moment from 'moment';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss']
})
export class EventCalendarComponent implements OnInit {
  @Output() onsaveChangesEvent: EventEmitter<any> = new EventEmitter<any>();
 @ViewChild('allSelectedOffice') private allSelectedOffice :MatOption;
 eventCalander: FormGroup;
 static_data: any;
 hideRequiredMarker: boolean = true;
 editGrid: boolean;
 selectedOffice: any;
 getAllEventsApi: any;
 eventId: any
 filerStatus: any;
 edittime: any;
  getEventByIds: any;
  filerType: any;
  fil: any[];
  filerTypeId: any;
  filing: any;
 constructor(
   private commonMethods: CommonMethods,
   public errorService: ErrorMessageService,
   public snackbar: SnackbarService,
   public dialog: MatDialog,
   public masterDate: MasterDataService,
   private service: ClientService,
   private urlService: MasterUrlService,
   private location: Location
 ) {}

 ngOnInit(): void {
   this.dataMatchingList.data = [];
   this.initElectionCycleForm();
   this.getAllEventsList();
   this.getFiler();
   this.commonMethods.setCurrentLanguage();
   this.static_data = this.commonMethods.getCurrentLanguage();
 }

 onChangeoffice(data) {

}
//Office Type
toggleAllSelectionOffice() {
  if (this.allSelectedOffice.selected) {
    this.eventCalander.controls.filer_type.patchValue([
      ...this.fil.map((item) => item.lookUpTypeId),
      0,
    ]);
  } else {
    this.eventCalander.controls.filer_type.patchValue([]);
  }
}
tosslePerOneOffice(all) {
  if (this.allSelectedOffice.selected) {
    this.allSelectedOffice.deselect();
    return false;
  }
  if (
    this.eventCalander.controls.filer_type.value.length ==
    this.fil.length
  )
    this.allSelectedOffice.select();
}
 initElectionCycleForm(data: any = {}) {
  if (data.filer_type_id) {
    this.filing.forEach((element: any) => {
      this.filerTypeId.push(element.filer_type_id);
      console.log(this.filerTypeId)
    });
  }
   this.eventCalander = new FormGroup({
     title: new FormControl(data.name),
     description: new FormControl(data.descr),
     filer_type: new FormControl(this.filerTypeId),
     date: new FormControl(data.eventdate),
     time: new FormControl(this.edittime),
     bump_filing: new FormControl(data.bump_filing_due),
   });
 }
 dataMatchingList = new MatTableDataSource();
 displayedStudentsColumnsList: string[] = [
   "title",
   "description",
   "date",
   "filer_type",
   "action",
 ];
 getAllEventsList() {
  this.service
    .getData(this.urlService.getEvents)
    .subscribe((res: any) => {
      this.getAllEventsApi = res;
      this.dataMatchingList.data = [...this.getAllEventsApi];
    });
}
getEventsById() {
  this.filerTypeId = [];
  let Id = this.eventId
   this.service
     .getData(this.urlService.getEventsById + Id)
     .subscribe((res: any) => {
       this.filing =res
       this.getEventByIds = res[0];
      this.initElectionCycleForm(this.getEventByIds);
     });
}
  getEventById(getEventById: any) {
    throw new Error('Method not implemented.');
  }
getFiler() {
  let lookUpTypeCode = "COM";
 this.service
   .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
   .subscribe((res: any) => {
     console.log(res);
     this.filerStatus = res;
     this.getFilerType();
   });
}
getFilerType() {
  let lookUpTypeCode = "FIL-TYPE";
 this.service
   .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
   .subscribe((res: any) => {
     this.filerType = res;
     this.fil = [...this.filerStatus, ...this.filerType] 
     console.log(this.fil)
   });
}
 openConfirmationModal(id: any): void {
   if (this.dataMatchingList.data.length <= 1)
     return this.snackbar.snackbarError(
       "Minimum one event is required",
       this.masterDate.centre
     );
   const dialogRef = this.dialog.open(DeleteModalComponent, {
     width: "460px",
     data: {
       id,
     },
   });

   dialogRef.afterClosed().subscribe((result) => {
     if (result && result !== "close") {
       this.service
         .postData(this.urlService.deleteEvents + id,{})
         .subscribe((res: any) => {
          this.getAllEventsList();
          this.eventCalander.reset();
           this.snackbar.snackbarError(
             "Events deleted successfully",
             this.masterDate.centre
           );
         });
     }
   });
 }
 check(event){
  console.log(event.checked)
  this.eventCalander.value.bump_filing_due = event.checked;
}
datePicker(value){
  if(value){
    let today: any = new Date(value);
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd + 'T00:00:00.000Z';
    return today;
  } 
 }
 save() {   
  if (this.eventCalander.valid) {
    let selectedFiler = [];
    if (this.eventCalander.value.filer_type){
    for(let filerType of this.fil){
      for (let selectedFilerType of  this.eventCalander.value.filer_type){
        if (selectedFilerType === filerType.lookUpTypeId){
          selectedFiler.push(filerType.lookUpTypeId)
        }
      }
    }
  }
   const temp = this.eventCalander.value.time;
   let momentObj = moment(temp, ["h:mm A"])
   let hourFormat = momentObj.format("HH:mm");
   let hour = hourFormat.split(':')[0];
   let min = hourFormat.split(':')[1];
   let dateTime: any = new Date(this.eventCalander.value.date);
   const dd = String(dateTime.getDate()).padStart(2, "0");
   const mm = String(dateTime.getMonth() + 1).padStart(2, "0"); // January is 0!
   const yyyy = dateTime.getFullYear();
   dateTime = yyyy + "-" + mm + "-" + dd + 'T'+hour+':'+min+':00.000Z';

   const id = {
      event_id: this.eventId ? this.eventId : 0,
      filer_type_id: selectedFiler.toString(),
      name: this.eventCalander.value.title,
      desc: this.eventCalander.value.description,
      eventdate: temp?dateTime:this.datePicker(this.eventCalander.value.date),
      bump_filing_due: this.eventCalander.value.bump_filing_due,
    };
      if (!this.editGrid) {
        this.service
          .postData(this.urlService.saveEvents, id)
          .subscribe((res: any) => {
            this.eventCalander.reset();
            this.eventId = 0;
            this.onsaveChangesEvent.emit();
            this.eventCalander.patchValue({
              bump_filing_due:""
            })
            this.getAllEventsList();
            this.snackbar.snackbarError(
              "Events added successfully",
              this.masterDate.centre
            );
          });
      } else {
        this.service
          .postData(this.urlService.saveEvents, id)
          .subscribe((res: any) => {
            this.eventCalander.reset();
            this.eventId = 0;
            this.onsaveChangesEvent.emit();
            this.eventCalander.patchValue({
              bump_filing_due:""
            })
            this.getAllEventsList();
            this.editGrid = false;
            this.snackbar.snackbarError(
              "Events updated successfully",
              this.masterDate.centre
            );
          });
      }
}else{
  this.eventCalander.markAllAsTouched();
}
}
 editOfficerForm(data: any) {
   document.querySelector(".mat-sidenav-content").scroll({ 
    top: 950, 
    left: 0, 
    behavior: 'smooth' 
  });
   this.eventId = data.event_id;
   this.editGrid = true;
   this.selectedOffice = data.officeTypeId;
   const temp = new Date(data.eventdate);
   this.edittime = moment(temp, 'ddd DD-MMM-YYYY, hh:mm A').format('hh:mm A')
   this.getEventsById() 
 }
 back() {
   if (this.eventCalander.dirty) {
     const options = {
       title: "Alert",
       message: "Are you sure you want to proceed without saving the changes?",
       cancelText: "Cancel",
       confirmText: "Yes",
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
         this.location.back();
       }
     });
   } else {
     this.location.back();
   }
 }
}
