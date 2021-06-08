import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonMethods, MasterDataService, MasterUrlService, ErrorMessageService, SnackbarService, LocalstorageService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-indipendent-expenditure',
  templateUrl: './indipendent-expenditure.component.html',
  styleUrls: ['./indipendent-expenditure.component.scss']
})
export class IndipendentExpenditureComponent implements OnInit {
  static_data: any = {};
  hideRequiredMarker: boolean = true;
  independentExpenditureForm: FormGroup;
  @Output() IEFormEmit = new EventEmitter<Object>();
  @Output() IEgoBackEmit = new EventEmitter<Object>();
  filerTypes: any = [];
  // filerRole: any = 'FT-IND';
  filerRole: any;

  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    private urlService: MasterUrlService,
    public errorService: ErrorMessageService,
    private fb: FormBuilder,
    private service: ClientService,
    public router: Router,
    public snackbar: SnackbarService,
    private localStore: LocalstorageService,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.independentExpenditureFilerForm();
    this.getFiler();
  }

  independentExpenditureFilerForm() {
    // this.filerRole == 'FT-IND';
    this.independentExpenditureForm = this.fb.group({
      filerType: ["", [Validators.required]],
      occupation: ["", []],
      employer: ["", []],
      organization:["", []],
    });
  }

  getFiler() {
    const user = {
      lookUpType: "FILER-TYPE",
    };
    this.service
      .getData(`${this.urlService.getList}?lookUpTypeCode=FILER-TYPE`)
      .subscribe((res: any) => {
        console.log(res);
        this.filerTypes = res;
        // this.independentExpenditureForm.patchValue({
        //   filerType: this.filerTypes[1].lookUpTypeId})
      });
  }

  changevalue() {
    this.filerRole = this.independentExpenditureForm.value.filerType;
    if(this.filerRole == "FT-ORG"){
      this.independentExpenditureForm.controls['organization'].setValidators([Validators.required]),
      this.independentExpenditureForm.controls['organization'].updateValueAndValidity()
      this.independentExpenditureForm.controls['employer'].clearValidators()
      this.independentExpenditureForm.controls['occupation'].clearValidators()
      this.independentExpenditureForm.patchValue({
         employer : "",
         occupation : ""
      });
    }else{
      this.independentExpenditureForm.controls['employer'].setValidators([Validators.required]),
      this.independentExpenditureForm.controls['employer'].updateValueAndValidity()
      this.independentExpenditureForm.controls['occupation'].setValidators([Validators.required]),
      this.independentExpenditureForm.controls['occupation'].updateValueAndValidity()
      this.independentExpenditureForm.controls['organization'].clearValidators()
      this.independentExpenditureForm.patchValue({
        organization : "",
     });
    }
  }

  SendNewIEDetail() {
    this.independentExpenditureForm.markAllAsTouched();

    if (this.independentExpenditureForm.invalid) {
      return this.snackbar.snackbarError('please fill out the required field', this.masterDate.centre)
    }

    this.IEFormEmit.emit(this.independentExpenditureForm.value)
  }

  Sendback() {
    if (this.independentExpenditureForm.dirty || this.independentExpenditureForm.valid) {
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
          this.IEgoBackEmit.emit();
        }
      });
    } else {
      this.IEgoBackEmit.emit();

    }

    // this.IEgoBackEmit.emit();
  }

}
