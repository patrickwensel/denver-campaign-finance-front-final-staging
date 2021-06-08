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
  selector: "app-matching-limit",
  templateUrl: "./matching-limit.component.html",
  styleUrls: ["./matching-limit.component.scss"],
})
export class MatchingLimitComponent implements OnInit {
  @ViewChild('allSelectedOffice') private allSelectedOffice: MatOption;
  publicfunding: FormGroup;
  static_data: any;
  hideRequiredMarker: boolean = true;
  matchingId: any;
  getElectionDate: any;
  editGrid: boolean;
  getAllMatchingListApi: any;
  getOfficeTypeData: any;
  selectedOffice: any;
  constructor(
    private commonMethods: CommonMethods,
    public errorService: ErrorMessageService,
    public snackbar: SnackbarService,
    public dialog: MatDialog,
    public masterDate: MasterDataService,
    private service: ClientService,
    private urlService: MasterUrlService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.dataMatchingList.data = [];
    this.initCommitteeOfficerForm();
    this.getElection();
    this.getAllOfficeList();
    this.getAllMatchingList();
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
  }
  getElection() {
    this.service
      .getData(this.urlService.getElectionCycle)
      .subscribe((res: any) => {
        this.getElectionDate = res;
      });
  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  
  getAllOfficeList() {
    this.service
      .getData(this.urlService.getallOfficeList)
      .subscribe((res: any) => {
        this.getOfficeTypeData = res;
      });
  }
  onChangeoffice(data) {
    let SelectedOfficeType = [];
    if (this.publicfunding.controls.qualifying_offices.value) {
      if (this.publicfunding.controls.qualifying_offices.value[0] === 0) {
        for (let filters of this.getOfficeTypeData) {
          SelectedOfficeType.push(filters.typeId)
        }
      }
      else {
        SelectedOfficeType = this.publicfunding.controls.qualifying_offices.value;
      }
    }
    this.selectedOffice = SelectedOfficeType ? SelectedOfficeType.toString() : "";
  }
  //Office Type
  toggleAllSelectionOffice() {
    if (this.allSelectedOffice.selected) {
      this.publicfunding.controls.qualifying_offices
        .patchValue([...this.getOfficeTypeData.map(item => item.typeId), 0]);
    } else {
      this.publicfunding.controls.qualifying_offices.patchValue([]);
    }
  }
  tosslePerOneOffice(all) {
    if (this.allSelectedOffice.selected) {
      this.allSelectedOffice.deselect();
      return false;
    }
    if (this.publicfunding.controls.qualifying_offices.value.length == this.getOfficeTypeData.length)
      this.allSelectedOffice.select();
  }
  initCommitteeOfficerForm(data: any = {}) {
    let qualify_office
    if (data.officeTypeId) {
      // qualify_office = data.officeTypeId.split(',').map(function (item) {
      //   return parseInt(item, 10);
      // });
      qualify_office = data.officeTypeId.split(',')
    }
    this.publicfunding = new FormGroup({
      election_cycle: new FormControl(data.electionCycle, [Validators.required]),
      start_date: new FormControl(data.startDate, [Validators.required]),
      end_date: new FormControl(data.enddate, [Validators.required]),
      qualifying_offices: new FormControl(qualify_office, [Validators.required]),
      available: new FormControl(data.totalAvailableFunds, [Validators.required]),
      ratio: new FormControl(data.matchingRatio, [Validators.required, Validators.pattern('^\\d+(:[A-Za-z0-9]+){1}$')]),
      qualifying_contribution: new FormControl(
        data.qualifyingContributionAmount,
        [Validators.required]
      ),
      number_of_req: new FormControl(
        data.numberRequiredQualifyingContributions,
        [Validators.required]
      ),
      contr_limit: new FormControl(data.contributionLimitsforParticipate, [Validators.required]),
      contr_amount: new FormControl(data.matchingContributionAmount, [Validators.required]),
    });
  }
  addmatchingLimits() {
    if (this.publicfunding.valid) {
      let selectedOfficeID = [];
      for (let filerType of this.getOfficeTypeData) {
        for (let selectedOfficeIDType of this.publicfunding.value.qualifying_offices) {
          if (selectedOfficeIDType === filerType.typeId) {
            selectedOfficeID.push(filerType.typeName)
          }
        }
      }
      const id = {
        qualifyingContributionAmount:typeof(this.publicfunding.value.qualifying_contribution) =='string'? parseInt((this.publicfunding.value.qualifying_contribution).replace(/,/g, "")):parseInt(this.publicfunding.value.qualifying_contribution),
        matchingId: this.matchingId ? this.matchingId : 0,
        matchingContributionAmount:typeof(this.publicfunding.value.contr_amount) =='string'? parseInt((this.publicfunding.value.contr_amount).replace(/,/g, "")):parseInt(this.publicfunding.value.contr_amount),
        numberRequiredQualifyingContributions:parseInt(this.publicfunding.value.number_of_req),
        matchingRatio: this.publicfunding.value.ratio,
        contributionLimitsforParticipate:typeof(this.publicfunding.value.contr_limit) =='string'? parseInt((this.publicfunding.value.contr_limit).replace(/,/g, "")):parseInt(this.publicfunding.value.contr_limit),
        totalAvailableFunds:typeof(this.publicfunding.value.available) =='string'? parseInt((this.publicfunding.value.available).replace(/,/g, "")):parseInt(this.publicfunding.value.available),
        qualifyingOffices: selectedOfficeID ? selectedOfficeID.toString() : "",
        officeTypeId: this.selectedOffice ? this.selectedOffice : "",
        startDate: this.publicfunding.value.start_date,
        enddate: this.publicfunding.value.end_date,
        electionCycle: this.publicfunding.value.election_cycle,
      };
      if (!this.editGrid) {
        this.service
          .postData(this.urlService.addMatchingLimits, id)
          .subscribe((res: any) => {
            this.publicfunding.reset();
            this.matchingId = 0;
            this.getAllMatchingList();
            this.snackbar.snackbarError(
              "Public funding added successfully",
              this.masterDate.centre
            );
          });
      } else {
        this.service
          .putData(this.urlService.updateMatchingLimits, id)
          .subscribe((res: any) => {
            this.publicfunding.reset();
            this.matchingId = 0;
            this.getAllMatchingList();
            this.editGrid = false;
            this.snackbar.snackbarError(
              "Public funding updated successfully",
              this.masterDate.centre
            );
          });
      }
    } else {
      this.publicfunding.markAllAsTouched();
    }
  }
  getAllMatchingList() {
    this.service
      .getData(this.urlService.getMatchingLimitsList)
      .subscribe((res: any) => {
        this.getAllMatchingListApi = res;
        this.dataMatchingList.data = [...this.getAllMatchingListApi];
      });
  }
  dataMatchingList = new MatTableDataSource();
  displayedStudentsColumnsList: string[] = [
    "qca",
    "No_of_required",
    "participants",
    "contribution_amount",
    "available_amount",
    "match_ratio",
    "qualifying_period",
    "qualifying_offices",
    "election",
    "action",
  ];

  openConfirmationModal(id: any): void {
    if (this.dataMatchingList.data.length <= 1)
      return this.snackbar.snackbarError(
        "Minimum one public funding is required",
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
          .delete(this.urlService.deleteMatchingLimits + "?Id=" + result)
          .subscribe((res: any) => {
            this.getAllMatchingList();
            this.publicfunding.reset();
            this.snackbar.snackbarError(
              "Public funding deleted successfully",
              this.masterDate.centre
            );
          });
      }
    });
  }
  editOfficerForm(data: any) {
    document.querySelector(".mat-sidenav-content").scrollTop = 0;
    this.matchingId = data.matchingId;
    this.editGrid = true;
    this.selectedOffice = data.officeTypeId;
    this.initCommitteeOfficerForm(data);
  }
  back() {
    if (this.publicfunding.dirty) {
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
  commaKey(e){
    if (e == "available"){
      let number = (this.publicfunding.value.available).split(',').join('');
    let numberVal = new Intl.NumberFormat('en-US').format(number);
     this.publicfunding.patchValue({
      available : numberVal
    })
  }else if(e == "qca"){
    let number = (this.publicfunding.value.qualifying_contribution).split(',').join('');
    let numberVal = new Intl.NumberFormat('en-US').format(number);
    this.publicfunding.patchValue({
      qualifying_contribution : numberVal
    })
  }else if(e == "contr_limit"){
    let number = (this.publicfunding.value.contr_limit).split(',').join('');
    let numberVal = new Intl.NumberFormat('en-US').format(number);
    this.publicfunding.patchValue({
      contr_limit : numberVal
    })
  }else if(e == "contr_amount"){
    let number = (this.publicfunding.value.contr_amount).split(',').join('');
    let numberVal = new Intl.NumberFormat('en-US').format(number);
    this.publicfunding.patchValue({
      contr_amount : numberVal
    })
  }

  }
}
