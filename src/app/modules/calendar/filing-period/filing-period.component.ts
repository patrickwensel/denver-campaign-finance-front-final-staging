import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CommonMethods, ErrorMessageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { Location } from "@angular/common";
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import moment from 'moment';
import { MatOption } from '@angular/material/core';
@Component({
  selector: 'app-filing-period',
  templateUrl: './filing-period.component.html',
  styleUrls: ['./filing-period.component.scss']
})
export class FilingPeriodComponent implements OnInit {
  @Output() onsaveChangesEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('allSelectedOffice') private allSelectedOffice :MatOption;
  filing_period: FormGroup;
  static_data: any;
  hideRequiredMarker: boolean = true;
  editGrid: boolean;
  selectedOffice: any;
  getAllFilingApi: any;
  filingPeriodId = 0;
  getElectionTypeData: any;
  filerStatus: any = [];
  getFilingById: any;
  filerTypeId: any = [];
  filing: any;
 edittime: any;
  type: boolean = false;
  filerType: any = [];
  fil: any = [];
  tmp: any;

  constructor(
    private commonMethods: CommonMethods,
    public errorService: ErrorMessageService,
    public snackbar: SnackbarService,
    public dialog: MatDialog,
    public masterDate: MasterDataService,
    private service: ClientService,
    private urlService: MasterUrlService,
    private location: Location
  ) {
  }
 
  ngOnInit(): void {
    this.dataMatchingList.data = [];
    this.initFilingPeriodForm();
    this.getAllFilingList();
    this.getElectionTypeList();
    this.getFilerCom();
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
  }
  getFilerCom() {
    let lookUpTypeCode = "COM";
   this.service
     .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
     .subscribe((res: any) => {
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
  getAllFilingList() {
    this.service
      .getData(this.urlService.getFilingPeriods)
      .subscribe((res: any) => {
        this.getAllFilingApi = res;
        this.dataMatchingList.data = [...this.getAllFilingApi];
      });
  }
  getFillingPeriodById() {
    this.filerTypeId = [];
    let electionCycleId = this.filingPeriodId
     this.service
       .getData(this.urlService.getFilingPeriodsById + electionCycleId)
       .subscribe((res: any) => {
         this.filing =res
         this.getFilingById = res[0];
        this.initFilingPeriodForm(this.getFilingById);
       });
 }
  getElectionTypeList() {
    this.service
      .getData(this.urlService.getElectionCycle)
      .subscribe((res: any) => {
        this.getElectionTypeData = res;
      });
  }
  onChangeoffice(data) {
    if (data.value[0] == "0" || data.value[0] == "COM-CAN" || data.value[0] == "COM-SDC" || data.value[0] == "COM-IE" || data.value[0] == "COM-IC"){
      this.type = true;
    }else{
      this.type = false;
    }
    let SelectedOfficeType = [];
    if(data.value.length == 0){
      this.type = false;
    }
    if (this.filing_period.controls.filer_type.value) {
      if (this.filing_period.controls.filer_type.value[0] === 0) {
        for (let filters of this.fil) {
          SelectedOfficeType.push(filters.officeId)
        }
      }
      else {
        SelectedOfficeType = this.filing_period.controls.filer_type.value;
      }
    }
    this.selectedOffice = SelectedOfficeType ? SelectedOfficeType.toString() : "";
  }
  //Office Type
  toggleAllSelectionOffice() {
    if (this.allSelectedOffice.selected) {
      this.filing_period.controls.filer_type
        .patchValue([...this.fil.map(item => item.lookUpTypeId), 0]);
    } else {
      this.filing_period.controls.filer_type.patchValue([]);
    }
  }
  tosslePerOneOffice(all) {
    if (this.allSelectedOffice.selected) {
      this.allSelectedOffice.deselect();
      this.type = false;
      return false;
    }
    if (this.filing_period.controls.filer_type.value.length == this.fil.length)
      this.allSelectedOffice.select();
  }
  initFilingPeriodForm(data: any = {}) {
    if (data.filerTypeId) {
      this.filing.forEach((element: any) => {
        this.filerTypeId.push(element.filerTypeId);
        console.log(this.filerTypeId)
      });
    }
    if (data.filerTypeId == "0" || data.filerTypeId == "COM-CAN" || data.filerTypeId == "COM-SDC" || data.filerTypeId == "COM-IE" || data.filerTypeId == "COM-IC"){
      this.type = true;
    }else{
      this.type = false;
    }
    this.filing_period = new FormGroup({
      title: new FormControl(data.filingPeriodName),
      description: new FormControl(data.description),
      filer_type: new FormControl(this.filerTypeId),
      start_date: new FormControl(data.startDate,[Validators.required]),
      end_date: new FormControl(data.enddate,[Validators.required]),
      date: new FormControl(data.duedate,[Validators.required]),
      time: new FormControl(this.edittime),
      electio_cycle: new FormControl(data.electionCycleId),
      threshold: new FormControl(data.itemThreshold)
    });
  }
  dataMatchingList = new MatTableDataSource();
  displayedStudentsColumnsList: string[] = [
    "title",
    "description",
    "election",
    "start_date",
    "end_date",
    "due_date",
    "due_time",
    "action",
  ];
 
  openConfirmationModal(id: any): void {
    if (this.dataMatchingList.data.length <= 1)
      return this.snackbar.snackbarError(
        "Minimum one Filing Period is required",
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
          .delete(this.urlService.deleteFilingPeriod + "?filingperiodid=" + result)
          .subscribe((res: any) => {
            this.getAllFilingList();
            this.filing_period.reset();
            this.snackbar.snackbarError(
              "Filing Period deleted successfully",
              this.masterDate.centre
            );
          });
      }
    });
  }
  
  datePicker(value){
   if(value){
     var businessDays = 7, counter = 0; // set to 1 to count from next business day
     while( businessDays>0 ){
     this.tmp = new Date(value);
     var startDate = new Date(value);
     this.tmp.setDate(startDate.getDate() + counter++);
     switch( this.tmp.getDay() ){
             case 0: case 6: break;// sunday & saturday
             default:
                //  businessDays--;
                let today: any = new Date(this.tmp);
                const dd = String(today.getDate()).padStart(2, "0");
                const mm = String(today.getMonth() + 1).padStart(2, "0");
                const yyyy = today.getFullYear();
                today = yyyy + "-" + mm + "-" + dd + 'T00:00:00.000Z';
                return today;
             }; 
     }
   } 
  }

  save() {    
   if (this.filing_period.valid) {
    let selectedFiler = [];
    if (this.filing_period.value.filer_type){
    for(let filerType of this.fil){
      for (let selectedFilerType of  this.filing_period.value.filer_type){
        if (selectedFilerType === filerType.lookUpTypeId){
          selectedFiler.push(filerType.lookUpTypeId)
        }
      }
    }
  }
    const temp = this.filing_period.value.time;
    let momentObj = moment(temp, ["h:mm A"])
    let hourFormat = momentObj.format("HH:mm");
    let hour = hourFormat.split(':')[0];
    let min = hourFormat.split(':')[1];
    let dateTime: any = new Date(this.filing_period.value.date);
    const dd = String(dateTime.getDate()).padStart(2, "0");
    const mm = String(dateTime.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = dateTime.getFullYear();
    dateTime = yyyy + "-" + mm + "-" + dd + 'T'+hour+':'+min+':00.000Z';

     const id = {
      filingPeriodId: this.filingPeriodId ? this.filingPeriodId : 0,
      filingPeriodName: this.filing_period.value.title,
      description: this.filing_period.value.description,
      startDate: this.datePicker(this.filing_period.value.start_date),
      enddate: this.datePicker(this.filing_period.value.end_date),
      duedate: temp?dateTime:this.datePicker(this.filing_period.value.date),
      electionCycleId: this.filing_period.value.electio_cycle?this.filing_period.value.electio_cycle:0,
      itemThreshold: typeof(this.filing_period.value.threshold) =='string'? parseInt((this.filing_period.value.threshold).replace(/,/g, "")) : parseInt(this.filing_period.value.threshold)?parseInt(this.filing_period.value.threshold):0,
      filingPeriodFilerTypeIds: selectedFiler.toString(),
     };
       if (!this.editGrid) {
         this.service
           .postData(this.urlService.saveFilingPeriod, id)
           .subscribe((res: any) => {
             this.onsaveChangesEvent.emit();
             this.filing_period.reset();
             this.filingPeriodId = 0;
             this.getAllFilingList();
             this.snackbar.snackbarError(
               "Filing Period added successfully",
               this.masterDate.centre
             );
           });
       } else {
         this.service
           .postData(this.urlService.saveFilingPeriod, id)
           .subscribe((res: any) => {
             this.filing_period.reset();
             this.filingPeriodId = 0;
             this.onsaveChangesEvent.emit();
             this.getAllFilingList();
             this.editGrid = false;
             this.snackbar.snackbarError(
               "Filing Period updated successfully",
               this.masterDate.centre
             );
           });
       }
 }else{
  this.filing_period.markAllAsTouched();
}
 }

  editOfficerForm(data: any) {
    document.querySelector(".mat-sidenav-content").scroll({ 
      top: 950, 
      left: 0, 
      behavior: 'smooth' 
    });
    this.filingPeriodId = data.filingPeriodId;
    this.editGrid = true;
    this.selectedOffice = data.officeTypeId;
    this.getFillingPeriodById();
   const temp = new Date(data.duedate);
   this.edittime = moment(temp, 'ddd DD-MMM-YYYY, hh:mm A').format('hh:mm A')
  }

  commaKey(){
      let number = (this.filing_period.value.threshold).split(',').join('');
    let numberVal = new Intl.NumberFormat('en-US').format(number);
     this.filing_period.patchValue({
      threshold : numberVal
    })
  }
  back() {
    if (this.filing_period.dirty) {
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
 