import { Component, OnInit } from '@angular/core';
import { LocalstorageService, CommonMethods, MasterDataService, MasterUrlService, ErrorMessageService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-filer-fines-andfees',
  templateUrl: './filer-fines-andfees.component.html',
  styleUrls: ['./filer-fines-andfees.component.scss']
})
export class FilerFinesAndfeesComponent implements OnInit {

  ELEMENT_DATA: any = [
    { position: '1234', name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: '4321', name: 'Helium', weight: 4.0026, symbol: 'He' },
  ];

  displayedColumns: string[] = ['invoice_number', 'type', 'description',
    'status', 'amount', 'rem_bal', 'view_invoice'];
  displayedColumns1: string[] = ['invoice_number', 'type', 'description',
    'date', 'amount', 'user', 'payment_method'];
  dataSource: any = [];
  static_data: any = {};
  name = 'Jon Rios for City Council';
  datasource_length: any;
  dataSourcePayment = new MatTableDataSource();
  dataSourcePayment_length: any;
  balance = 0
  collectedFee = 0
  waivedFee = 0;
  reducedFee = 0;
  entityid: any;
  entityType: any;

  constructor(
    private localStore: LocalstorageService,
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    private urlService: MasterUrlService,
    public errorService: ErrorMessageService,
    private service: ClientService,

  ) { }

  ngOnInit(): void {
    this.entityid = this.localStore.getLocalStorage('choosen_id');
    if (this.localStore.getLocalStorage('user_chosen') == 'Lobbyist') {
      this.entityType = 'L';
    } else if (this.localStore.getLocalStorage('user_chosen') == 'committee') {
      this.entityType = 'C';
    } else if (this.localStore.getLocalStorage('user_chosen') == 'ie') {
      this.entityType = 'IE';
    }
    // this.localStore.getLocalStorage('choosen_id');
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.getOustandingGrid();
    this.getOustandingFees();
    this.getPaymentHistory();
  }

  getOustandingFees() {
    this.service
      .getData(this.urlService.getFilerOutstandingFees + '?entityid=' + this.entityid + '&entitytype=' + this.entityType)
      .subscribe((res: any) => {
        this.balance = res[0].totalOutstandingFeeBalance;
        this.collectedFee = res[0].totalFeesCollectedToDate;
        this.waivedFee = res[0].totalFeesWaived;
        this.reducedFee = res[0].totalFeesReduced;
      });
  }

  getOustandingGrid() {
    this.service
      .getData(this.urlService.getFilerInvoices + '?entityid=' + this.entityid + '&entitytype=' + this.entityType)
      .subscribe((res: any) => {
        this.dataSource = res;
        this.datasource_length = res.length;

      });
  }

  getPaymentHistory() {
    this.service
      .getData(this.urlService.getEntityPaymentHistory + '?entityid=' + this.entityid + '&entitytype=' + this.entityType)
      .subscribe((res: any) => {
        this.dataSourcePayment = res;
        this.dataSourcePayment_length = res.length;

      });
  }


}
