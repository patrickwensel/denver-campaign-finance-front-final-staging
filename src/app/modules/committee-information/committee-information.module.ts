import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommitteeInformationRoutingModule } from './committee-information-routing.module';
import { CommitteeInformationDashboardComponent } from './committee-information-dashboard/committee-information-dashboard.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { AdminManageUserComponent } from './admin-manage-user/admin-manage-user.component';
@NgModule({
  declarations: [CommitteeInformationDashboardComponent, ManageUserComponent, AdminManageUserComponent],
  imports: [
    CommonModule,
    CommitteeInformationRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    AuthRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class CommitteeInformationModule { }
