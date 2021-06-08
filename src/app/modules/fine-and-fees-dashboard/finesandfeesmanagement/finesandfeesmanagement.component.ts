import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonMethods, MasterUrlService, SnackbarService, LocalstorageService, MasterDataService, ErrorMessageService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import { Location } from "@angular/common";
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';


export interface source {
  name: string;
  amount: string;
  graceperiod: string;
  filertype: string;
  frequency: string;
}

const ELEMENT_DATA: source[] = [
  { name: 'Hydrogen', amount: 'gjhg', graceperiod: 'ty', filertype: 'hjlk', frequency: 'dsfsad' },
  { name: 'Hydrogen', amount: 'gjhg', graceperiod: 'ty', filertype: 'hjlk', frequency: 'vbnvbn' },
];

export interface source1 {
  name: string;
  amount: string;
  filertype: string;
  frequency: string;
}

const ELEMENT_DATA1: source1[] = [
  { name: 'Hydrogen', amount: 'gjhg', filertype: 'hjlk', frequency: 'dsfsad' },
  { name: 'Hydrogen', amount: 'gjhg', filertype: 'hjlk', frequency: 'vbnvbn' },
];





@Component({
  selector: 'app-finesandfeesmanagement',
  templateUrl: './finesandfeesmanagement.component.html',
  styleUrls: ['./finesandfeesmanagement.component.scss']
})
export class FinesandfeesmanagementComponent implements OnInit {

  latefinegroup: FormGroup;
  feegroup: FormGroup;
  hideRequiredMarker: boolean = true;
  static_data: any;
  filerType: any;
  filerStatus: any = [];
  fil: any[] = [];
  editGrid: boolean;
  fineid: any;
  feeid: any;
  editFeeGrid: boolean;
  selectedFilterType: string;
  selectedFilerFee: string;
  datasource_length: any;
  dataSourcefees_length: any;


  constructor(
    private commonMethods: CommonMethods,
    private fb: FormBuilder,
    private service: ClientService,
    private urlService: MasterUrlService,
    private snackbar: SnackbarService,
    private localStore: LocalstorageService,
    public masterDate: MasterDataService,
    public router: Router,
    public dialog: MatDialog,
    public errorService: ErrorMessageService,
    private location: Location


  ) { }

  displayedColumns: string[] = ['name', 'amount', 'graceperiod', 'filertype', 'frequency', 'icons'];
  displayedColumns1: string[] = ['name', 'amount', , 'graceperiod', 'filertype', 'frequency', 'icons'];

  frequencies = [
    { value: 'D', viewValue: 'Daily' },
    { value: 'W', viewValue: 'Weekly' },
    { value: 'M', viewValue: 'Monthly' },
    // {value: 'Y', viewValue: 'Yearly'}
  ];
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allSelectedFeefiler') private allSelectedFeefiler: MatOption;


  ngOnInit(): void {
    this.initlateFeesForm();
    this.initFeesForm();
    this.getFilerType();
    // this.getFilerCom();
    this.getFines();
    this.getFees();
    this.getFilerTypeforfine();
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.onChangeType({});
    this.onChangeTypeFee({});
  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  dataSource = new MatTableDataSource();
  dataSourcefees = new MatTableDataSource();


  // getFilerCom() {
  //   let lookUpTypeCode = "COM";
  //   this.service
  //     .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
  //     .subscribe((res: any) => {
  //       this.filerStatus = res;
  //       this.getFilerType();
  //     });
  // }
  // getFilerType() {
  //   let lookUpTypeCode = "FIL-TYPE";
  //   this.service
  //     .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
  //     .subscribe((res: any) => {
  //       this.filerType = res;
  //       this.fil = [...this.filerStatus, ...this.filerType]
  //     });
  // }

  datePicker(value) {
    if (value) {
      let today: any = new Date(value);
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
      const yyyy = today.getFullYear();
      today = yyyy + "-" + mm + "-" + dd + 'T00:00:00.000Z';
      return today;
    }
  }


  commaPatch(data) {
    data.toString();
    // let x = data
    // let number = (x).split(',').join('');
    let numberVal = new Intl.NumberFormat('en-US').format(data);
    return numberVal;
  }

  commaKey(type) {
    if (type == 'latefine') {
      let number = (this.latefinegroup.value.amount).split(',').join('');
      let numberVal = new Intl.NumberFormat('en-US').format(number);
      this.latefinegroup.patchValue({
        amount: numberVal
      })
    } else if (type == 'feegroup') {
      let number = (this.feegroup.value.amount).split(',').join('');
      let numberVal = new Intl.NumberFormat('en-US').format(number);
      this.feegroup.patchValue({
        amount: numberVal
      })
    }

  }

  getFilerType() {
    let lookUpTypeCode = "FIL-TYPE";
    this.service
      .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
      .subscribe((res: any) => {
        this.fil = res;
        // this.fil = [...this.filerStatus, ...this.filerType]
        this.fil[3].lookUpName = 'Independent Expenditure'

      });
  }

  getFilerTypeforfine() {
    let lookUpTypeCode = "FIL-TYPE";
    this.service
      .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
      .subscribe((res: any) => {
        this.filerType = res;
        // this.fil = [...this.filerStatus, ...this.filerType]
        this.filerType.splice(3, 1);

      });
  }

  // getFilerType() {
  //   this.service.getData(this.urlService.getLookUps+ "AC").subscribe((res) => {
  //     this.filerType = res;
  //     // https://denverapi-dev.augustasoftsol.com/api/LookUp/getLookUps?lookUpTypeCode='COM'
  //   })
  // }

  initlateFeesForm(data: any = {}) {
    this.latefinegroup = this.fb.group({
      name: [data.fineName || null, [Validators.maxLength(120)]],
      amount: [(data.amount) ? this.commaPatch(data.amount) : '', [Validators.maxLength(13)]],
      graceperiod: [data.gracePeriod || null, [Validators.maxLength(3)]],
      filertype: [data.fineFilerTypeIds || null, [Validators.required]],
      frequency: [data.frequency || null, [Validators.required]],
    })
  }
  initFeesForm(data: any = {}) {
    this.feegroup = this.fb.group({
      name: [data.name || null, [Validators.maxLength(120)]],
      amount: [(data.amount) ? this.commaPatch(data.amount) : '', [Validators.maxLength(13)]],
      duedate: [data.duedate || null, []],
      invoicedate: [data.invoice_date || null, []],
      filertype: [data.filername || null, [Validators.required]],
    })
  }

  getFines() {
    this.service.getData(this.urlService.getFines).subscribe((res: any) => {
      this.dataSource = res;
      this.datasource_length = res.length;

    });
  }


  getFees() {
    this.service.getData(this.urlService.getfees).subscribe((res: any) => {
      this.dataSourcefees = res;
      this.dataSourcefees_length = res.length;
    });
  }

  //FilerType
  toggleAllSelectionType() {
    if (this.allSelected.selected) {
      this.latefinegroup.controls.filertype
        .patchValue([...this.filerType.map(item => item.lookUpTypeId), 0]);
    } else {
      this.latefinegroup.controls.filertype.patchValue([]);
      // this.getUserType =[];
    }
    this.onChangeType({});
  }

  toggleAllSelectionTypeFees() {
    if (this.allSelectedFeefiler.selected) {
      this.feegroup.controls.filertype
        .patchValue([...this.fil.map(item => item.lookUpTypeId), 0]);
    } else {
      this.feegroup.controls.filertype.patchValue([]);
      // this.getUserType =[];
    }
    this.onChangeTypeFee({});
  }
  onChangeType(data) {

    let SelectedType = [];
    if (this.latefinegroup.controls.filertype.value) {
      if (this.latefinegroup.controls.filertype.value[0] === 0) {
        for (let filters of this.filerType) {
          SelectedType.push(filters.lookUpTypeId)
        }
      }
      else {
        SelectedType = this.latefinegroup.controls.filertype.value;
      }
    }
    this.selectedFilterType = SelectedType ? SelectedType.toString() : "";

  }

  onChangeTypeFee(data) {

    let SelectedType = [];
    if (this.feegroup.controls.filertype.value) {
      if (this.feegroup.controls.filertype.value[0] === 0) {
        for (let filters of this.fil) {
          SelectedType.push(filters.lookUpTypeId)
        }
      }
      else {
        SelectedType = this.feegroup.controls.filertype.value;
      }
    }
    this.selectedFilerFee = SelectedType ? SelectedType.toString() : "";

  }


  tosslePerOneType(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.latefinegroup.controls.filertype.value.length == this.filerType.length)
      this.allSelected.select();
  }

  tosslePerOneTypefee(all) {
    if (this.allSelectedFeefiler.selected) {
      this.allSelectedFeefiler.deselect();
      return false;
    }
    if (this.feegroup.controls.filertype.value.length == this.fil.length)
      this.allSelectedFeefiler.select();
  }

  addfunc() {
    if (this.latefinegroup.invalid) {
      this.latefinegroup.markAllAsTouched();
    }
    const y: number = +this.latefinegroup.value.amount;
    const z: number = +this.latefinegroup.value.graceperiod;
    const latefinebody = {
      fineId: this.fineid ? this.fineid : 0,
      fineName: this.latefinegroup.value.name,
      amount: typeof(this.latefinegroup.value.amount) == 'string' ? parseInt((this.latefinegroup.value.amount).replace(/,/g, "")) : parseInt(this.latefinegroup.value.amount),
      gracePeriod: z,
      frequency: this.latefinegroup.value.frequency,
      fineFilerTypeIds: this.selectedFilterType
    };
    if (this.latefinegroup.valid) {

      this.service.postData(this.urlService.latefine, latefinebody).subscribe((res: any) => {
        if (res.hasError) {
          if (res.message) {
            return this.snackbar.snackbarError(res.message, 'center');
          } else {
            return this.snackbar.snackbarError(this.masterDate.errorMsg, 'center');
          }
        } else {
          if (this.editGrid) {
            this.editGrid = false;
            this.getFines();
            this.latefinegroup.reset();
            this.fineid = 0;
            return this.snackbar.snackbarError('Late Fine Updated Successfully', 'center');

          } else {
            this.latefinegroup.reset();
            this.getFines();
            this.fineid = 0;
            return this.snackbar.snackbarError('Late Fine Added Successfully', 'center');

          }
          // this.router.navigate([this.masterDate.login]);
        }
      }, err => {
        if (err && err.hasError) {
          this.snackbar.snackbarError(err.message || this.masterDate.errorMsg, 'center');
        } else {
          this.snackbar.snackbarError(this.masterDate.errorMsg, 'center');
        }
      });

      // this.service
      //   .postData(this.urlService.resetPassword, )
      //   .subscribe((res: any) => {
      //     this.confirmSubmit = res[0];
      //     console.log(this.confirmSubmit);
      //   });
    }
  }


  addfees() {
    const o: number = +this.feegroup.value.amount;
    const feebody = {
      feeId: this.feeid ? this.feeid : 0,
      name: this.feegroup.value.name,
      amount: typeof (this.feegroup.value.amount) == 'string' ? parseInt((this.feegroup.value.amount).replace(/,/g, "")) : parseInt(this.feegroup.value.amount),
      duedate: this.datePicker(this.feegroup.value.duedate),
      invoice_date: this.datePicker(this.feegroup.value.invoicedate),
      filerType_id: this.selectedFilerFee
    };
    if (this.feegroup.invalid) {
      this.feegroup.markAllAsTouched();
    }
    if (this.feegroup.valid) {
      this.service.postData(this.urlService.addfees, feebody).subscribe((res: any) => {
        if (res.hasError) {
          if (res.message) {
            return this.snackbar.snackbarError(res.message, 'center');
          } else {
            return this.snackbar.snackbarError(this.masterDate.errorMsg, 'center');
          }
        } else {
          if (this.editFeeGrid) {
            this.editFeeGrid = false;
            this.feegroup.reset();
            this.getFees();
            this.feeid = 0;
            return this.snackbar.snackbarError('Fee Updated Successfully', 'center');

          } else {
            this.feegroup.reset();
            this.getFees();
            this.feeid = 0;
            return this.snackbar.snackbarError('Fee Added Successfully', 'center');

          }

          // this.router.navigate([this.masterDate.login]);
        }
      }, err => {
        if (err && err.hasError) {
          this.snackbar.snackbarError(err.message || this.masterDate.errorMsg, 'center');
        } else {
          this.snackbar.snackbarError(this.masterDate.errorMsg, 'center');
        }
      });
      // this.service
      //   .postData(this.urlService.resetPassword, )
      //   .subscribe((res: any) => {
      //     this.confirmSubmit = res[0];
      //     console.log(this.confirmSubmit);
      //   });
    }
  }


  editlatefine(data) {
    let arr = [];
    document.querySelector(".mat-sidenav-content").scrollTop = 0;
    this.fineid = data.fineId;
    if (data.fineFilerTypeIds) {
      arr = data.fineFilerTypeIds.replace(" ", "").split(",");
    }
    data.fineFilerTypeIds = arr;
    this.editGrid = true;
    this.initlateFeesForm(data);

  }

  openConfirmationModal(id: any): void {

    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: "460px",
      data: {
        id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== "close") {
        this.service
          .delete(this.urlService.deleteFine + '?fineId=' + id)
          .subscribe((res: any) => {
            this.getFines();
            this.latefinegroup.reset();
            this.snackbar.snackbarError(
              "Late Fine deleted successfully",
              this.masterDate.centre
            );
          });
      }
    });
    // this.service.delete(this.urlService.deleteFine+ '?fineId=' + '8').subscribe((res: any) => {
    //   if (res.hasError) {
    //     if (res.message) {
    //       return this.snackbar.snackbarError(res.message, 'center');
    //     } else {
    //       return this.snackbar.snackbarError(this.masterDate.errorMsg, 'center');
    //     }
    //   } else {
    //     this.snackbar.snackbarError(res.message, 'center');
    //     this.router.navigate([this.masterDate.login]);
    //   }
    // }, err => {
    //   if (err && err.hasError) {
    //     this.snackbar.snackbarError(err.message || this.masterDate.errorMsg, 'center');
    //   } else {
    //     this.snackbar.snackbarError(this.masterDate.errorMsg, 'center');
    //   }
    // });

  }

  editfee(data) {
    let arr = [];
    document.querySelector(".mat-sidenav-content").scroll({
      top: 950,
      left: 0,
      behavior: 'smooth'
    });
    if (data.filername) {
      arr = data.filername.replace(" ", "").split(",");
    }
    data.filername = arr;
    this.feeid = data.feeid;
    this.editFeeGrid = true;
    this.initFeesForm(data);
  }

  openConfirmationModalfee(id: any): void {

    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: "460px",
      data: {
        id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== "close") {
        this.service
          .postData(this.urlService.deleteFees + '?fee_Id=' + id, {})
          .subscribe((res: any) => {
            this.getFees();
            this.feegroup.reset();
            this.snackbar.snackbarError(
              "Fee deleted successfully",
              this.masterDate.centre
            );
          });
      }
    });
    // this.service.delete(this.urlService.deleteFine+ '?fineId=' + '8').subscribe((res: any) => {
    //   if (res.hasError) {
    //     if (res.message) {
    //       return this.snackbar.snackbarError(res.message, 'center');
    //     } else {
    //       return this.snackbar.snackbarError(this.masterDate.errorMsg, 'center');
    //     }
    //   } else {
    //     this.snackbar.snackbarError(res.message, 'center');
    //     this.router.navigate([this.masterDate.login]);
    //   }
    // }, err => {
    //   if (err && err.hasError) {
    //     this.snackbar.snackbarError(err.message || this.masterDate.errorMsg, 'center');
    //   } else {
    //     this.snackbar.snackbarError(this.masterDate.errorMsg, 'center');
    //   }
    // });



  }

  back() {
    if ((this.feegroup.dirty || this.feegroup.valid) || (this.latefinegroup.dirty || this.latefinegroup.valid)) {
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
