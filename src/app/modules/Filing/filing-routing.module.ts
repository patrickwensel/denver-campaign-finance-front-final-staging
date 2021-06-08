import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchTransactionsComponent } from './search-transactions/search-transactions.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { GiftReportComponent } from './gift-report/gift-report.component';
import { CityitemsReportComponent } from './cityitems-report/cityitems-report.component';
import { FinancialdisclosurestmtComponent } from './financialdisclosurestmt/financialdisclosurestmt.component';
import { EthicsReportComponent } from './ethics-report/ethics-report.component';
import { SearchContactsComponent } from './search-contacts/search-contacts.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { CompaignFinanceReportComponent } from './compaign-finance-report/compaign-finance-report.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: "Transactions",
        component: TransactionsComponent
      },
      {
        path: "Search-Transactions",
        component: SearchTransactionsComponent
      },
      {
        path: "Search-contacts",
        component: SearchContactsComponent
      },
      {
        path: "upload-data",
        component: UploadDataComponent
      },
      {
        path: "compaign-finance",
        component: CompaignFinanceReportComponent
      },
      {
        path: "Gift_Report",
        component: GiftReportComponent
      },
      {
        path: "city_items",
        component: CityitemsReportComponent
      },
      {
        path: "financial_disclosure",
        component: FinancialdisclosurestmtComponent
      },
      {
        path: "ethics_report",
        component: EthicsReportComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilingRoutingModule { }
