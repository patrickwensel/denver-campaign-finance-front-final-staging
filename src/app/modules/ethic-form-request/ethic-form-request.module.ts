import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthicFormRequestComponent } from './ethic-form-request/ethic-form-request.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { EthicFormRequestRoutingModule } from './ethic-form-request-routing-module';



@NgModule({
  declarations: [EthicFormRequestComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    EthicFormRequestRoutingModule
  ]
})
export class EthicFormRequestModule { }
