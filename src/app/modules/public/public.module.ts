import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Material Imports
import { MaterialModule } from 'src/app/shared/modules/material.module';

import { PublicRoutingModule } from './public-routing.module';
import { PublicLayoutComponent } from './public-layout/public-layout.component';

// chart js 
import { ChartsModule } from 'ng2-charts';
import { PublicGiftComponent } from './public-gift/public-gift.component';
import { PublicCityReportComponent } from './public-city-report/public-city-report.component';
import { PublicOfficerFinancialStatementComponent } from './public-officer-financial-statement/public-officer-financial-statement.component'


@NgModule({
  declarations: [PublicLayoutComponent, PublicGiftComponent, PublicCityReportComponent, PublicOfficerFinancialStatementComponent],
  imports: [
    CommonModule,
    PublicRoutingModule,
    RouterModule,
    MaterialModule,
    ChartsModule
  ]
})
export class PublicModule { }
