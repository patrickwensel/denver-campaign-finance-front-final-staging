import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import {
  CommonMethods,
  ErrorMessageService,
  MasterDataService,
  MasterUrlService,
  SnackbarService,
} from "src/app/core";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { ClientService } from "src/app/core/api-services/client.service";
import { Location } from "@angular/common";
import { ConfirmPopupComponent } from "src/app/shared/components/confirm-popup/confirm-popup.component";
import { MatOption } from "@angular/material/core";

@Component({
  selector: "app-contribution-limits",
  templateUrl: "./contribution-limits.component.html",
  styleUrls: ["./contribution-limits.component.scss"],
})
export class ContributionLimitsComponent implements OnInit {
  @ViewChild('allSelectedCType') private allSelectedCType :MatOption;
  @ViewChild('allSelectedOffice') private allSelectedOffice :MatOption;

  contribution: FormGroup;
  static_data: any;
  hideRequiredMarker: boolean = true;
  FormEditId: any = 0;
  editGrid: boolean;
  getContributionData: any;
  ContributionId: any;
  getFilerTypeData: any;
  getDonorTypeData: any;
  getOfficeTypeData: any;
  getElectionDate: any;
  selectedFilterType: any;
  selectedOffice:any;
  showOffice: boolean = true;
  constructor(
    private commonMethods: CommonMethods,
    public errorService: ErrorMessageService,
    public snackbar: SnackbarService,
    public dialog: MatDialog,
    private service: ClientService,
    public masterDate: MasterDataService,
    private urlService: MasterUrlService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.dataContributionList.data = [];
    this.initCommitteeOfficerForm();
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.getFilerTypeList();
    this.getAllOfficeList();
    this.getDonorTypeList();
    this.getElection();
    this.getContributionList();
  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  
  initCommitteeOfficerForm(data: any = {}) {
    let committeeType
    if (data.commiteeTypeId){
      committeeType= data.commiteeTypeId.split(',')
    //   .map(function(item) {
    //     return parseInt(item, 10);
    // });
    }
    let office
    if (data.officeTypeId){
      office= data.officeTypeId.split(',')
    //   .map(function(item) {
    //     return parseInt(item, 10);
    // });
    }
    this.contribution = new FormGroup({
      filer_type: new FormControl(committeeType, [Validators.required]),
      office: new FormControl(office, []),
      donar_type: new FormControl(data.donorTypeId, [Validators.required]),
      contribution_limit: new FormControl(data.contLimit),
      elect_cycle: new FormControl(data.electionYear, [Validators.required]),
    });
  }
  //CommitteeType
toggleAllSelectionCType() {
  if (this.allSelectedCType.selected) {
    this.contribution.controls.filer_type
      .patchValue([...this.getFilerTypeData.map(item => item.typeId), 0]);
  } else {
    this.contribution.controls.filer_type.patchValue([]);
  }
}
tosslePerOneCType(all){
  if (this.allSelectedCType.selected) {
   this.allSelectedCType.deselect();
   return false;
}
 if(this.contribution.controls.filer_type.value.length==this.getFilerTypeData.length)
   this.allSelectedCType.select();
}

//Office Type
toggleAllSelectionOffice() {
  if (this.allSelectedOffice.selected) {
    this.contribution.controls.office
      .patchValue([...this.getOfficeTypeData.map(item => item.typeId), 0]);
  } else {
    this.contribution.controls.office.patchValue([]);
  }
}
tosslePerOneOffice(all){
  if (this.allSelectedOffice.selected) {
   this.allSelectedOffice.deselect();
   return false;
}
 if(this.contribution.controls.office.value.length==this.getOfficeTypeData.length)
   this.allSelectedOffice.select();
}
onChangeType(data){
  if (data.value[0] == "0" || data.value[0] == "COM-CAN"){
    this.showOffice = true;
    this.contribution.controls['office'].setValidators([Validators.required]);
    this.contribution.controls['office'].updateValueAndValidity();
  }else{
    this.contribution.patchValue({
      office : "",
   });
   this.selectedOffice = ""
    this.contribution.controls['office'].clearValidators();
    this.contribution.controls['office'].updateValueAndValidity();
    this.showOffice = false;
  }
  let SelectedCType =[];
  if( this.contribution.controls.filer_type.value){
    if( this.contribution.controls.filer_type.value[0] === 0){
      for (let filters of this.getFilerTypeData) {
        SelectedCType.push(filters.typeId)
      }
    }
    else{
      SelectedCType = this.contribution.controls.filer_type.value;
    }
  }
  this.selectedFilterType = SelectedCType ? SelectedCType.toString() : "";
}
onChangeoffice(data){
  let SelectedOfficeType =[];
  if( this.contribution.controls.office.value){
    if( this.contribution.controls.office.value[0] === 0){
      for (let filters of this.getOfficeTypeData) {
        SelectedOfficeType.push(filters.typeId)
      }
    }
    else{
      SelectedOfficeType = this.contribution.controls.office.value;
    }
  }
  this.selectedOffice = SelectedOfficeType ? SelectedOfficeType.toString() : "";
}
  save() {
    if (this.contribution.valid) {
      let selectedFilter = [];
      for(let filerType of this.getFilerTypeData){
        for (let selectedFilterType of this.contribution.value.filer_type){
          if (selectedFilterType === filerType.typeId){
            selectedFilter.push(filerType.typeName)
          }
        }
      }
      let selectedOffice = [];
      if (this.contribution.value.office){
      for(let office of this.getOfficeTypeData){
        for (let selectedOfficeType of this.contribution.value.office){
          if (selectedOfficeType === office.typeId){
            selectedOffice.push(office.typeName)
          }
        }
      }
    }
      const id = {
        id: this.ContributionId ? this.ContributionId : 0,
        commiteeTypeId: this.selectedFilterType?this.selectedFilterType:"",
        commiteeType: selectedFilter ? selectedFilter.toString() : "",
        officeTypeId: this.selectedOffice ? this.selectedOffice : "",
        officeType: selectedOffice ? selectedOffice.toString(): "",
        donorTypeId: this.contribution.value.donar_type,
        donorType: this.getDonorTypeData.find((element) => {
          return element.lookUpTypeId == this.contribution.value.donar_type;
        }).lookUpName,
        contLimit: typeof(this.contribution.value.contribution_limit) =='string' ? parseInt((this.contribution.value.contribution_limit).replace(/,/g, "")) : parseInt(this.contribution.value.contribution_limit),
        electionCycleId:  this.getElectionDate.find((element) => {
          return element.electionCycle == this.contribution.value.elect_cycle;
        }).electionCycleId,
        electionYear: this.contribution.value.elect_cycle,
        tenantId: 1,
        descript: "",
      };
      if (!this.editGrid) {
        this.service
          .postData(this.urlService.createContribution, id)
          .subscribe((res: any) => {
            this.contribution.reset();
            this.ContributionId = 0;
            this.getContributionList();
            this.snackbar.snackbarError(
              "Contribution limits added successfully",
              this.masterDate.centre
            );
          });
      } else {
        this.service
          .putData(this.urlService.updateContribution, id)
          .subscribe((res: any) => {
            this.contribution.reset();
            this.ContributionId = 0;
            this.getContributionList();
            this.editGrid = false;
            this.snackbar.snackbarError(
              "Contribution limits updated successfully",
              this.masterDate.centre
            );
          });
      }
    }else{
      this.contribution.markAllAsTouched();
     }
  }
  getFilerTypeList() {
    this.service
      .getData(this.urlService.getCommitteTypeList)
      .subscribe((res: any) => {
        this.getFilerTypeData = res;
      });
  }
  getElection() {
    this.service
      .getData(this.urlService.getElectionCycle)
      .subscribe((res: any) => {
        this.getElectionDate = res;
      });
  }
  getDonorTypeList() {
    let lookUpTypeCode = "FILER-TYPE";
    this.service
      .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
      .subscribe((res: any) => {
        console.log(res);
        this.getDonorTypeData = res;
      });
  }
  getAllOfficeList() {
    this.service
      .getData(this.urlService.getallOfficeList)
      .subscribe((res: any) => {
        this.getOfficeTypeData = res;
      });
  }
  getContributionList() {
    this.service
      .getData(this.urlService.getContribution)
      .subscribe((res: any) => {
        this.getContributionData = res;
        this.dataContributionList.data = [...this.getContributionData];
      });
  }
  dataContributionList = new MatTableDataSource();
  displayedStudentsColumnsList: string[] = [
    "filerType",
    "officeTypeId",
    "electionYear",
    "donorTypeId",
    "limit",
    "action",
  ];

  openConfirmationModal(id: any): void {
    if (this.dataContributionList.data.length <= 1)
      return this.snackbar.snackbarError(
        "Minimum one officer is required",
        this.masterDate.centre
      );
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: "460px",
      // height: "350px",
      data: {
        id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== "close") {
        this.service
          .delete(this.urlService.deleteContribution + "?id=" + result)
          .subscribe((res: any) => {
            this.getContributionList();
            this.contribution.reset();
            this.snackbar.snackbarError(
              "Contribution limits deleted successfully",
              this.masterDate.centre
            );
          });
      }
    });
  }
  editOfficerForm(data: any) {
    document.querySelector(".mat-sidenav-content").scrollTop = 0;
    this.editGrid = true;
    this.ContributionId = data.id;
    this.selectedFilterType = data.commiteeTypeId;
    this.selectedOffice = data.officeTypeId;
    this.initCommitteeOfficerForm(data);
  }
  commaKey(){
      let number = (this.contribution.value.contribution_limit).split(',').join('');
    let numberVal = new Intl.NumberFormat('en-US').format(number);
     this.contribution.patchValue({
      contribution_limit : numberVal
    })
  }
  back() {
    if (this.contribution.dirty) {
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
