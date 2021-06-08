import { Component, OnInit } from '@angular/core';
import { CommonMethods, MasterUrlService, MasterDataService, ErrorMessageService, SnackbarService, LocalstorageService } from 'src/app/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ClientService } from 'src/app/core/api-services/client.service';
import { Location } from "@angular/common";
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: string;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-fine-and-fees',
  templateUrl: './fine-and-fees.component.html',
  styleUrls: ['./fine-and-fees.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})




export class FineAndFeesComponent implements OnInit {
  static_data: any;
  balance: any;
  collectedFee: any;
  waivedFee: any;
  reducedFee: any;
  datasource_length: any;
  dataSource: any;
  transactionform: FormGroup;
  penaltyform: FormGroup;
  hideRequiredMarker: boolean = true;
  submitted: boolean;
  statusBool = false;
  sub: Subscription;
  id: any;
  dataSource_length: any;
  frequencies: any;
  entityid: any;
  entityType: string;
  feegroup: any;
  type: string;
  payment_methods: any;
  desc: any;
  dataSourcepayment: any;
  dataSourcepayment_length: any;

  constructor(
    private commonMethods: CommonMethods,
    private fb: FormBuilder,
    private urlService: MasterUrlService,
    private service: ClientService,
    public masterDate: MasterDataService,
    private location: Location,
    private activeroute: ActivatedRoute,
    private snackbar: SnackbarService,
    public errorService: ErrorMessageService,
    private localStore: LocalstorageService,
    public masterData: MasterDataService

  ) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.sub = this.activeroute.paramMap.subscribe(params => {
      console.log(params);
      this.id = params.get('id');
      this.type = params.get('type');
    });
    if (this.type == 'AC-LOB') {
      this.type = 'L';
    } else if (this.type == 'AC-CAN') {
      this.type = 'C';
    }

    this.initForm();
    this.getOustandingFees();
    this.getOustandingGrid();
    this.getStatusList();
    this.initPenaltyForm();
    this.getPaymentmethods();
    this.getPaymentHistory();
  }
  // displayedColumns: string[] = ['invoice_number', 'type', 'description',
  //   'amount', 'rem_balance', 'view_attchment', 'view_invoice'];
  displayedColumns: string[] = ['dropdwn', 'invoice_number', 'type', 'invstatus', 'bal',
    'view_atch', 'view_invoice'];

  displayedColumns1: string[] = ['dropdwn', 'invoice_number', 'type', 'filername',
    'date', 'amount', 'view_atch', 'view_invoice'

  ]
  getOustandingFees() {
    this.service
      .getData(this.urlService.getOustandingSummary + this.id)
      .subscribe((res: any) => {
        this.balance = Number(res[0].totalOutstandingFeeBalance)
        this.collectedFee = Number(res[0].totalFeesCollectedToDate);
        this.waivedFee = Number(res[0].totalFeesWaived);
        this.reducedFee = Number(res[0].totalFeesReduced);
      });
  }



  getOustandingGrid() {
    this.service
      .getData(this.urlService.getOutstandingGrid + this.id)
      .subscribe((res: any) => {
        this.dataSource = res;
        this.dataSource_length = res.length;
        for (let i of this.dataSource) {
          if (i.invoiceStatus == "Paid") {
            i.invoiceStatus = 'P'
          } else if (i.invoiceStatus == "Under Review ") {
            i.invoiceStatus = 'UND'
          }
        }
      });
  }

  getinvoiceDetails() {
    let invoiceId = this.transactionform.value.invoice_number;
    this.service.getData(this.urlService.getInvoiceFromId + invoiceId).subscribe((res: any) => {
      console.log(res[0].invoiceType);
      console.log(res[0].invoiceDesc);
      this.transactionform.patchValue({
        type: res[0].invoiceType,
        description: res[0].invoiceDesc
      })
      this.desc = res[0].invoiceDesc
    })
  }

  commaKey(type) {
    if (type == 'penalty') {
      let number = (this.penaltyform.value.amount).split(',').join('');
      let numberVal = new Intl.NumberFormat('en-US').format(number);
      this.penaltyform.patchValue({
        amount: numberVal
      })
    } else if (type == 'transaction') {
      let number = (this.transactionform.value.amount).split(',').join('');
      let numberVal = new Intl.NumberFormat('en-US').format(number);
      this.transactionform.patchValue({
        amount: numberVal
      })
    }

  }

  getStatusList() {
    this.service
      .getData(this.urlService.getFilerTypes + 'INVOICE_STATUS')
      .subscribe((res: any) => {
        this.frequencies = res;
      });
  }


  onChangeStatus(data, element) {
    const body = {
      invoiceId: element.invoiceId,
      invoiceType: element.invoiceType,
      invoiceDesc: element.invoiceDesc,
      filerName: element.filerName,
      invoiceStatus: element.status,
      amount: element.amount,
      remainingAmount: element.remainingAmount,
      penaltyAttachmentId: element.penaltyAttachmentId
    }
    this.service
      .postData(this.urlService.updateStatus, body)
      .subscribe((res: any) => {
        console.log(res);
      });
  }


  initForm() {
    this.transactionform = this.fb.group({
      invoice_number: ["" || null, [Validators.required, Validators.maxLength(10)]],
      type: ["", [Validators.minLength(2), Validators.maxLength(80), Validators.required]],
      description: ["" || null,
      [
        Validators.minLength(2),
        Validators.maxLength(150),
      ],
      ],
      amount: ["" || null, [Validators.maxLength(13)]],
      date: ["" || null, []],
      user: ["" || null, []],
      payment_method: ["" || null, [Validators.required]],
      // comments: ["" || null, []],
    });
    this.transactionform.controls['type'].disable();
    this.transactionform.controls['description'].disable();
  }

  getPaymentmethods() {
    this.service
      .getData(this.urlService.getFilerTypes + 'PYMT_MD')
      .subscribe((res: any) => {
        this.payment_methods = res;
      });
  }


  initPenaltyForm() {
    this.penaltyform = this.fb.group({
      amount: ["" || null, [Validators.required, Validators.maxLength(13)]],
      date: ["" || null, [Validators.required]],
      reason: ["" || null, [Validators.required, Validators.maxLength(150)]]
    })
  }

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

  addpenalty() {
    if (this.penaltyform.invalid) {
      this.penaltyform.markAllAsTouched();
    }

    const feebody = {
      penaltyID: 0,
      amount: typeof (this.penaltyform.value.amount) == 'string' ? parseInt((this.penaltyform.value.amount).replace(/,/g, "")) : parseInt(this.feegroup.value.amount),
      reason: this.penaltyform.value.reason,
      entityId: Number(this.id),
      entitytype: this.type,
      paymentdate: this.datePicker(this.penaltyform.value.date),
    };

    if (this.penaltyform.valid) {
      this.service.postData(this.urlService.savePenalty, feebody).subscribe((res: any) => {
        if (res.hasError) {
          if (res.message) {
            return this.snackbar.snackbarError(res.message, 'center');
          } else {
            return this.snackbar.snackbarError(this.masterDate.errorMsg, 'center');
          }
        } else {
          this.getPaymentHistory();
          this.penaltyform.reset();
          return this.snackbar.snackbarError('Penalty Added Successfully', 'center');
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


  addtransaction() {
    if (this.transactionform.invalid) {
      this.transactionform.markAllAsTouched();
    }

    const body = {
      "invoiceId": Number(this.transactionform.value.invoice_number),
      "amount": typeof (this.transactionform.value.amount) == 'string' ? parseInt((this.transactionform.value.amount).replace(/,/g, "")) : parseInt(this.transactionform.value.amount),
      "description": this.desc,
      "paymentDate": this.datePicker(this.transactionform.value.date),
      "user": this.transactionform.value.user,
      "paymentMethod": this.transactionform.value.payment_method
    }

    if (this.transactionform.valid) {
      this.service.postData(this.urlService.saveTransaction, body).subscribe((res: any) => {
        if (res.hasError) {
          if (res.message) {
            return this.snackbar.snackbarError(res.message, 'center');
          } else {
            return this.snackbar.snackbarError(this.masterDate.errorMsg, 'center');
          }
        } else {
          this.getPaymentHistory();
          this.transactionform.reset();
          return this.snackbar.snackbarError('Transaction Added Successfully', 'center');
        }
      }, err => {
        if (err && err.hasError) {
          this.snackbar.snackbarError(err.message || this.masterDate.errorMsg, 'center');
        } else {
          this.snackbar.snackbarError(this.masterDate.errorMsg, 'center');
        }
      });
    }
  }


  addfunc() {
    this.submitted = true;
  }
  getPaymentHistory() {
    this.service.getData(this.urlService.getFilerPaymentHistory + this.id).subscribe((res: any) => {
      this.dataSourcepayment = res;
      this.dataSourcepayment_length = res.length
    })
  }
}
