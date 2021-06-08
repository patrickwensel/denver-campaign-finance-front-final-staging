import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilingRoutingModule } from './filing-routing.module';
import { TransactionsComponent } from './transactions/transactions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { SearchTransactionsComponent } from './search-transactions/search-transactions.component';

import { GiftReportComponent } from './gift-report/gift-report.component';
import { CityitemsReportComponent } from './cityitems-report/cityitems-report.component';
import { FinancialdisclosurestmtComponent } from './financialdisclosurestmt/financialdisclosurestmt.component';
import { EthicsReportComponent } from './ethics-report/ethics-report.component';
import { SearchContactsComponent } from './search-contacts/search-contacts.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { CompaignFinanceReportComponent } from './compaign-finance-report/compaign-finance-report.component';
import { MatIconModule } from '@angular/material/icon';
import { TransactionsLoanComponent } from './transactions-loan/transactions-loan.component';
import { TransactionsExpenditureComponent } from './transactions-expenditure/transactions-expenditure.component';
import { TransactionsUnpaidoblicationComponent } from './transactions-unpaidoblication/transactions-unpaidoblication.component';


@NgModule({

  declarations: [TransactionsComponent, GiftReportComponent, SearchTransactionsComponent, CityitemsReportComponent,EthicsReportComponent, FinancialdisclosurestmtComponent, SearchContactsComponent, UploadDataComponent, CompaignFinanceReportComponent, TransactionsLoanComponent, TransactionsExpenditureComponent, TransactionsUnpaidoblicationComponent],
  imports: [
    CommonModule,
    FilingRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    MatIconModule
  ]
})
export class FilingModule { }
