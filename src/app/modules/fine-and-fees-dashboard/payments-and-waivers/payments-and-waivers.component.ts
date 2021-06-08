import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PeriodicElement } from '../../ethic-form-request/ethic-form-request/ethic-form-request.component';
import { CommonMethods, MasterUrlService, MasterDataService, SnackbarService, ErrorMessageService } from 'src/app/core';
import { MatOption } from '@angular/material/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { Location } from "@angular/common";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-payments-and-waivers',
  templateUrl: './payments-and-waivers.component.html',
  styleUrls: ['./payments-and-waivers.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class PaymentsAndWaiversComponent implements OnInit {

  static_data: any;
  balance: any;
  collectedFee: any;
  waivedFee: any;
  reducedFee: any;
  datasource_length: any;
  dataSource : any
  dataSourcepayment= new MatTableDataSource();
  dataSourcepayment_length: any;
  transactionform: FormGroup;
  paymenthistoryform: FormGroup;
  hideRequiredMarker: boolean = true;
  submitted: boolean;
  dwnldform: FormGroup
  getUserType: any;
  getElectionTypeData: any;
  status: any;
  desc: any;
  pageNumber: any;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];



  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;


  selectedFilterType = "";
  getCommitteeList: any;
  frequencies: any;
  payment_methods: any;

  // frequencies = [
  //   { value: 'D', viewValue: 'Under Review' },
  //   { value: 'W', viewValue: 'Paid' },
  // ];
  // MatPaginator Output
  pageEvent: PageEvent;

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }


  constructor(
    private commonMethods: CommonMethods,
    private fb: FormBuilder,
    private urlService: MasterUrlService,
    private service: ClientService,
    public masterDate: MasterDataService,
    private location: Location,
    private snackbar: SnackbarService,
    public errorService: ErrorMessageService,
    public masterData: MasterDataService,
    private changeDetectorRefs: ChangeDetectorRef,

  ) { }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.initpaymentForm();
    this.initMsgForm();
    this.initFormtransaction();
    this.getFilerType();
    this.onChangeType({});
    this.getElectionTypeList();
    this.getSearchFilerName();
    this.getOustandingFees();
    this.getOustandingGrid();
    this.getStatusList();
    this.getPaymentmethods();
  }

  initMsgForm() {
    this.dwnldform = this.fb.group({
      date: [],
    })
  }
  onInputEmpty(data:any){
    if(!data)
    this.onChangeType({});
  }

  getStatusList() {
    this.service
      .getData(this.urlService.getFilerTypes + 'INVOICE_STATUS')
      .subscribe((res: any) => {
        this.frequencies = res;
      });
  }

  getPaymentmethods() {
    this.service
      .getData(this.urlService.getFilerTypes + 'PYMT_MD')
      .subscribe((res: any) => {
        this.payment_methods = res;
      });
  }


  getSearchFilerName(event: any = null) {
    let value = '';
    if (event)
      value = event.target.value;
    this.service.getData(this.urlService.getsearchFilter + "?searchName=" + value).subscribe((res) => {
      // this.typeCommittee = res;
      this.getCommitteeList = res;
    })
  }
  getElectionTypeList() {
    this.service
      .getData(this.urlService.getElectionCycle)
      .subscribe((res: any) => {
        this.getElectionTypeData = res;
      });
  }

  getFilerType() {
    this.service
      .getData(this.urlService.getFilerTypes + 'AC')
      .subscribe((res: any) => {
        this.getUserType = res;
      });
  }

  getOustandingFees() {
    this.service
      .getData(this.urlService.getOustandingSummary + 0)
      .subscribe((res: any) => {

        this.balance = Number(res[0].totalOutstandingFeeBalance);
        this.collectedFee = Number(res[0].totalFeesCollectedToDate);
        this.waivedFee = Number(res[0].totalFeesWaived);
        this.reducedFee = Number(res[0].totalFeesReduced);
      });
  }

  getOustandingGrid() {
    this.service
      .getData(this.urlService.getOutstandingGrid + 0)
      .subscribe((res: any) => {
        this.dataSource = res;
        this.datasource_length= res.length;
        for (let i of this.dataSource) {
          if (i.invoiceStatus == "Paid") {
            i.invoiceStatus = 'P'
          } else if (i.invoiceStatus == "Under Review ") {
            i.invoiceStatus = 'UND'
          }
        }
      });
  }


  // displayedColumns: string[] = ['invoice_number', 'type', 'description',
  //   'amount', 'rem_balance', 'view_attchment', 'view_invoice'];
  displayedColumns: string[] = ['dropdwn', 'invoice_number', 'type', 'invstatus', 'bal',
    'view_atch', 'view_invoice'];
  displayedColumns1: string[] = ['dropdwn', 'invoice_number', 'type', 'filername',
    'date', 'amount', 'view_atch', 'view_invoice'

  ]

  initFormtransaction() {
    this.transactionform = this.fb.group({
      invoice_number: ["" || null, [Validators.maxLength(10), Validators.required]],
      type: ["", [Validators.minLength(2), Validators.maxLength(80), Validators.required]],
      description: ["" || null,
      [
        Validators.minLength(2),
        Validators.maxLength(150),
        Validators.required
      ],
      ],
      amount: ["" || null, [Validators.maxLength(13), Validators.required]],
      date: ["" || null, []],
      user: ["" || null, [Validators.required]],
      payment_method: ["" || null, [Validators.required]],
      // comments: ["" || null, []],
    });
    this.transactionform.controls['type'].disable();
    this.transactionform.controls['description'].disable();

  }

  initpaymentForm() {

    this.paymenthistoryform = this.fb.group({
      search: ["" || null, []],
      filertype: ["" || null, []],
      // reason: ["" || null, []],
      mindate: ["" || null, []],
      maxdate: ["" || null, []],
      electioncycle: ["" || null, []]
    })
  }

  commaKey(type) {
    if (type == 'transaction') {
      let number = (this.transactionform.value.amount).split(',').join('');
      let numberVal = new Intl.NumberFormat('en-US').format(number);
      this.transactionform.patchValue({
        amount: numberVal
      })
    } else if (type == 'feegroup') {
      let number = (this.transactionform.value.amount).split(',').join('');
      let numberVal = new Intl.NumberFormat('en-US').format(number);
      this.transactionform.patchValue({
        amount: numberVal
      })
    }

  }
  //FilerType
  toggleAllSelectionType() {
    if (this.allSelected.selected) {
      this.paymenthistoryform.controls.filertype
        .patchValue([...this.getUserType.map(item => item.lookUpTypeId), 0]);
    } else {
      this.paymenthistoryform.controls.filertype.patchValue([]);
      // this.getUserType =[];
    }
    this.onChangeType({});
  }

  tosslePerOneType(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.paymenthistoryform.controls.filertype.value.length == this.getUserType.length)
      this.allSelected.select();
  }

  onChangeType(data) {

    let SelectedType = [];
    if (this.paymenthistoryform.controls.filertype.value) {
      if (this.paymenthistoryform.controls.filertype.value[0] === 0) {
        for (let filters of this.getUserType) {
          SelectedType.push(filters.lookUpTypeId)
        }
      }
      else {
        SelectedType = this.paymenthistoryform.controls.filertype.value;
      }
    }
    this.selectedFilterType = SelectedType ? SelectedType.toString() : "";
    this.getPaymentHistory();
  }

  onChangeStatus(data, element) {
    const body = {
      invoiceId: element.invoiceId,
      invoiceType: element.invoiceType,
      invoiceDesc: element.invoiceDesc,
      filerName: element.filerName,
      invoiceStatus: element.invoiceStatus,
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

  back() {
    this.location.back();
  }


  addfunc() {
    this.submitted = true;
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

  getPaymentHistory() {
    let filerName = this.paymenthistoryform.value.search ? this.paymenthistoryform.value.search:"";
    let filerType = this.selectedFilterType ? this.selectedFilterType : "";
    let startDate = this.paymenthistoryform.value.mindate ? this.datePicker(this.paymenthistoryform.value.mindate): "";
    let endDate = this.paymenthistoryform.value.maxdate ? this.datePicker(this.paymenthistoryform.value.maxdate): "";
    let electionCycleId = this.paymenthistoryform.value.electioncycle ?this.paymenthistoryform.value.electioncycle: 0;
    this.service.getData(this.urlService.getpaymentHistory + '?filerName=' + filerName + '&filerType=' + filerType + '&startDate=' + startDate + '&endDate' +
    endDate + '&electionCycleId=' + electionCycleId).subscribe((res: any) => {
      this.dataSourcepayment = new MatTableDataSource(res);
      this.dataSourcepayment_length = res.length;
      setTimeout(() => {
        this.dataSourcepayment.data = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.table.renderRows();
        this.changeDetectorRefs.detectChanges();
      }, 200);
    })
    
    // if (filerName && filerType) {
    //   this.service.getData(this.urlService.getpaymentHistory + '?filerName=' + filerName + '&filerType=' + filerType + '&startDate=' + startDate + '&endDate' +
    //     endDate + '&electionCycleId=' + electionCycleId).subscribe((res: any) => {
    //       this.dataSourcepayment = res;
    //       this.dataSourcepayment_length = res.length
    //     })
    // } else if (!filerName && filerType) {
    //   this.service.getData(this.urlService.getpaymentHistory + '?filerType=' + filerType + '&startDate=' + startDate + '&endDate' +
    //     endDate + '&electionCycleId=' + electionCycleId).subscribe((res: any) => {
    //       this.dataSourcepayment = res;
    //       this.dataSourcepayment_length = res.length
    //     })
    // } else if (filerName && !filerType) {
    //   this.service.getData(this.urlService.getpaymentHistory + '?filerName=' + filerName + '&startDate=' + startDate + '&endDate' +
    //     endDate + '&electionCycleId=' + electionCycleId).subscribe((res: any) => {
    //       this.dataSourcepayment = res;
    //       this.dataSourcepayment_length = res.length
    //     })
    // } else if (!filerName && !filerType) {
    //   this.service.getData(this.urlService.getpaymentHistory + '?startDate=' + startDate + '&endDate' +
    //     endDate + '&electionCycleId=' + electionCycleId).subscribe((res: any) => {
    //       this.dataSourcepayment = res;
    //       this.dataSourcepayment_length = res.length
    //     })
    // }


  }

  custom() {
    this.paginator.pageIndex = this.pageNumber; // number of the page you

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
          this.transactionform.reset();
          return this.snackbar.snackbarError('Transaction Added Successfully', 'center');
        }
      }, err => {
        if (err && err.hasError) {
          this.snackbar.snackbarError(err.message || this.masterDate.errorMsg, 'center');
        } else {
          this.getPaymentHistory();
          this.transactionform.reset();
          this.snackbar.snackbarError(this.masterDate.errorMsg, 'center');
        }
      });
    }
  }

  downloadCSV(self, fileName?) {
    self.hasDataLoaded = true;
    let filerName = this.paymenthistoryform.value.search ? this.paymenthistoryform.value.search:"";
    let filerType = this.selectedFilterType ? this.selectedFilterType : "";
    let startDate = this.paymenthistoryform.value.mindate ? this.datePicker(this.paymenthistoryform.value.mindate): "";
    let endDate = this.paymenthistoryform.value.maxdate ? this.datePicker(this.paymenthistoryform.value.maxdate): "";
    let electionCycleId = this.paymenthistoryform.value.electioncycle ?this.paymenthistoryform.value.electioncycle: 0;
    
    return this.service.getData(this.urlService.dwnldPaymentHistory + '?filerName=' + filerName + '&filerType=' + filerType + '&startDate=' + startDate + '&endDate' +
        endDate + '&electionCycleId=' + electionCycleId).subscribe((res: any) => {
          self.hasDataLoaded = false;
          // var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          var contentType = 'text/csv';
    
          var blob1 = this.b64toBlob(res.excelDocumentByte, contentType, null);
          var blobUrl1 = URL.createObjectURL(blob1);
          var a = window.document.createElement("a");
          a.href = blobUrl1
          a.download = "Manage Filer Detail.csv";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          // window.open(blobUrl1);
        }, error => {
          self.hasDataLoaded = false;
        })
  }



  //Convert base64 into blob
  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }



}
