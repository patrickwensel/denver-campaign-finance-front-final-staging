import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicCityReportComponent } from './public-city-report/public-city-report.component';
import { PublicGiftComponent } from './public-gift/public-gift.component';


// Routing components
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { PublicOfficerFinancialStatementComponent } from './public-officer-financial-statement/public-officer-financial-statement.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: "Public-layout",
        component: PublicLayoutComponent
      },
      {
        path: "Public-gifts",
        component: PublicGiftComponent
      },
      {
        path: "Public-city",
        component:PublicCityReportComponent
      },
      {
        path: "Public-officer",
        component:PublicOfficerFinancialStatementComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
