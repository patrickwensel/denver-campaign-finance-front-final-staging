import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateDetailsComponent } from './candidate-details/candidate-details.component';
import { CandidateRoutingModule } from './candidate-routing.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { NgApexchartsModule } from "ng-apexcharts";
@NgModule({
  declarations: [CandidateDetailsComponent],
  imports: [
    CommonModule,
    CandidateRoutingModule,
    MaterialModule,
    NgApexchartsModule
  ]
})
export class CandidateModule { }
