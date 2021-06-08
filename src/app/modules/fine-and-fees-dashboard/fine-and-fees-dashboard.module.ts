import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FineAndFeesDashboardRoutingModule } from './fine-and-fees-dashboard-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { DashboardModule } from '../Dashboard/dashboard.module';
import { PaymentsAndWaiversComponent } from './payments-and-waivers/payments-and-waivers.component';
import { FinesandfeesmanagementComponent } from './finesandfeesmanagement/finesandfeesmanagement.component';
import { FinefeesdashboardComponent } from './finefeesdashboard/finefeesdashboard.component';
import { FilerFinesAndfeesComponent } from './filer-fines-andfees/filer-fines-andfees.component';
import { FineAndFeesComponent } from './fine-and-fees/fine-and-fees.component';


@NgModule({
  declarations: [FineAndFeesComponent, PaymentsAndWaiversComponent, FinesandfeesmanagementComponent, FinefeesdashboardComponent, FilerFinesAndfeesComponent],
  imports: [
    CommonModule,
    FineAndFeesDashboardRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    DashboardModule,
    FlexLayoutModule
  ]
})
export class FineAndFeesDashboardModule { }
