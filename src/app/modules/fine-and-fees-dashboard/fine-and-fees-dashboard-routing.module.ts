import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentsAndWaiversComponent } from './payments-and-waivers/payments-and-waivers.component';
import { FinesandfeesmanagementComponent } from './finesandfeesmanagement/finesandfeesmanagement.component';
import { FinefeesdashboardComponent } from './finefeesdashboard/finefeesdashboard.component';
import { FilerFinesAndfeesComponent } from './filer-fines-andfees/filer-fines-andfees.component';
import { FineAndFeesComponent } from './fine-and-fees/fine-and-fees.component';
const routes: Routes = [
  {
    path: "",
    component: FilerFinesAndfeesComponent
  },
  {
    path: "finesandfees/:id/:type",
    component: FineAndFeesComponent
  },
  {
    path: "payments",
    component: PaymentsAndWaiversComponent
  },
  {
    path: "latefine",
    component: FinesandfeesmanagementComponent
  },
  {
    path: "navigate",
    component: FinefeesdashboardComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FineAndFeesDashboardRoutingModule { }
