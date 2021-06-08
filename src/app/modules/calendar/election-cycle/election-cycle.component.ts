import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import {
  CommonMethods,
  ErrorMessageService,
  MasterDataService,
  MasterUrlService,
  SnackbarService,
} from "src/app/core";
import { ClientService } from "src/app/core/api-services/client.service";
import { ConfirmPopupComponent } from "src/app/shared/components/confirm-popup/confirm-popup.component";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { Location } from "@angular/common";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
@Component({
  selector: "app-election-cycle",
  templateUrl: "./election-cycle.component.html",
  styleUrls: ["./election-cycle.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class ElectionCycleComponent implements OnInit {
  @Output() onsaveChangesEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("allSelectedOffice") private allSelectedOffice: MatOption;
  electionCycle: FormGroup;
  static_data: any;
  hideRequiredMarker: boolean = true;
  editGrid: boolean;
  selectedOffice: any;
  getAllElectionCycleApi: any;
  electionTypes: any;
  electionCycleId: any;
  electionStatus: any;
  getOfficeTypeData: any;
  getElectionCycleById: any;
  type: string;
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
    this.getAllElectionCycleList();
    this.getElectionType();
    this.getStatus();
    this.getAllOfficeList();
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.electionCycle.get("status").setValue("ACT");
  }
  getAllElectionCycleList() {
    this.service
      .getData(this.urlService.getElectionCycle)
      .subscribe((res: any) => {
        this.getAllElectionCycleApi = res;
        this.dataMatchingList.data = [...this.getAllElectionCycleApi];
      });
  }
  getAllElectionCycleById() {
    let electionCycleId = this.electionCycleId;
    this.service
      .getData(this.urlService.getElectionCycleById + electionCycleId)
      .subscribe((res: any) => {
        console.log(res);
        this.getElectionCycleById = res[0];
        this.initElectionCycleForm(this.getElectionCycleById);
      });
  }
  changevalue(e) {
    if ( e.lookUpOrder == 3){
      this.type = "SPL";
    }
    else if (e.lookUpOrder == 1) {
      this.type = "CANSPL";
    } else {
      this.type = "ISS";
    }
  }
  getElectionType() {
    let lookUpTypeCode = "ELECTION-TYPE";
    this.service
      .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
      .subscribe((res: any) => {
        console.log(res);
        this.electionTypes = res;
      });
  }
  getStatus() {
    let lookUpTypeCode = "ELECTION-STATUS";
    this.service
      .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
      .subscribe((res: any) => {
        console.log(res);
        this.electionStatus = res;
      });
  }
  onChangeoffice(data) {
    let SelectedOfficeType = [];
    if (this.electionCycle.controls.offices.value) {
      if (this.electionCycle.controls.offices.value[0] === 0) {
        for (let filters of this.getOfficeTypeData) {
          SelectedOfficeType.push(filters.officeId);
        }
      } else {
        SelectedOfficeType = this.electionCycle.controls.offices.value;
      }
    }
    this.selectedOffice = SelectedOfficeType
      ? SelectedOfficeType.toString()
      : "";
  }
  //Office Type
  toggleAllSelectionOffice() {
    if (this.allSelectedOffice.selected) {
      this.electionCycle.controls.offices.patchValue([
        ...this.getOfficeTypeData.map((item) => item.lookUpTypeId),
        0,
      ]);
    } else {
      this.electionCycle.controls.offices.patchValue([]);
    }
  }
  tosslePerOneOffice(all) {
    if (this.allSelectedOffice.selected) {
      this.allSelectedOffice.deselect();
      return false;
    }
    if (
      this.electionCycle.controls.offices.value.length ==
      this.getOfficeTypeData.length
    )
      this.allSelectedOffice.select();
  }
  initElectionCycleForm(data: any = {}) {
    let office;
    if (data.officeIds) {
      office = data.officeTypeId.split(",")
    }
    this.electionCycle = new FormGroup({
      title: new FormControl(data.electionName,[Validators.required]),
      description: new FormControl(data.description),
      election_type: new FormControl(data.electionTypeId,[Validators.required]),
      offices: new FormControl(office),
      district: new FormControl(data.district),
      Ec_start_date: new FormControl(data.startDate,[Validators.required]),
      Ec_end_date: new FormControl(data.endDate,[Validators.required]),
      Ie_start_date: new FormControl(data.ieStartDate),
      Ie_end_date: new FormControl(data.ieEndDate),
      status: new FormControl(data.status),
      election_date: new FormControl(data.electionDate,[Validators.required]),
    });
  }
  changeStatus(e) {
    console.log(e.value);
    let d = new Date();
    var g1 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    // (YYYY, MM, DD)
    let c = new Date(e.value);
    console.log(c);
    var g2 = new Date(c.getFullYear(), c.getMonth(), c.getDate());
    if (g1.getTime() > g2.getTime()) {
      this.electionCycle.get("status").setValue("COM");
    } else {
      this.electionCycle.get("status").setValue("ACT");
    }
  }
  dataMatchingList = new MatTableDataSource();
  displayedStudentsColumnsList: string[] = [
    "toggle",
    "title",
    "election_type",
    "Ec_start_date",
    "Ec_end_date",
    "Election_date",
    "status",
    "action",
  ];
  getAllOfficeList() {
    let lookUpTypeCode = "OFF";
    this.service
      .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
      .subscribe((res: any) => {
        this.getOfficeTypeData = res;
      });
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
    if (this.electionCycle.valid) {
      let selectedFiler = [];
      if (this.electionCycle.value.offices){
    for (let filerType of this.getOfficeTypeData) {
      for (let selectedFilerType of this.electionCycle.value.offices) {
        if (selectedFilerType === filerType.lookUpTypeId) {
          selectedFiler.push(filerType.lookUpTypeId);
        }
      }
    }
  }
      const id = {
        electionCycleId: this.electionCycleId ? this.electionCycleId : 0,
        name: this.electionCycle.value.title,
        electionTypeId: this.electionCycle.value.election_type,
        startDate: this.datePicker(this.electionCycle.value.Ec_start_date),
        endDate: this.datePicker(this.electionCycle.value.Ec_end_date),
        electionDate: this.datePicker(this.electionCycle.value.election_date),
        status: this.electionCycle.value.status,
        description: this.electionCycle.value.description,
        district: this.electionCycle.value.district?this.electionCycle.value.district:"",
        ieStartDate: this.datePicker(this.electionCycle.value.Ie_start_date),
        ieEndDate: this.datePicker(this.electionCycle.value.Ie_end_date),
        userId: "",
        offices: selectedFiler,
      };
      if (!this.editGrid) {
        this.service
          .postData(this.urlService.saveElectionCycle, id)
          .subscribe((res: any) => {
            this.electionCycle.reset();
            this.electionCycleId = 0;
            this.onsaveChangesEvent.emit();
            this.getAllElectionCycleList();
            this.snackbar.snackbarError(
              "Election cycle added successfully",
              this.masterDate.centre
            );
          });
      } else {
        this.service
          .postData(this.urlService.saveElectionCycle, id)
          .subscribe((res: any) => {
            this.electionCycle.reset();
            this.electionCycleId = 0;
            this.onsaveChangesEvent.emit();
            this.getAllElectionCycleList();
            this.editGrid = false;
            this.snackbar.snackbarError(
              "Election cycle updated successfully",
              this.masterDate.centre
            );
          });
      }
    }else{
      this.electionCycle.markAllAsTouched();
    }
  }
  openConfirmationModal(id: any): void {
    if (this.dataMatchingList.data.length <= 1)
      return this.snackbar.snackbarError(
        "Minimum one election cycle is required",
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
          .postData(this.urlService.deleteElectionCycle + result, {})
          .subscribe((res: any) => {
            this.getAllElectionCycleList();
            this.electionCycle.reset();
            this.snackbar.snackbarError(
              "Election cycle deleted successfully",
              this.masterDate.centre
            );
          });
      }
    });
  }
  editOfficerForm(data: any) {
    document.querySelector(".mat-sidenav-content").scroll({ 
      top: 950, 
      left: 0, 
      behavior: 'smooth' 
    });
    if ( data.electionCycleTypeId == "SPL"){
      this.type = "SPL";
    }
    else if (data.electionCycleTypeId == "CAN") {
      this.type = "CANSPL";
    }else{
      this.type = "ISS";
    }
    this.electionCycleId = data.electionCycleId;
    this.editGrid = true;
    this.selectedOffice = data.officeTypeId;
    this.getAllElectionCycleById();
  }
  back() {
    if (this.electionCycle.dirty) {
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
