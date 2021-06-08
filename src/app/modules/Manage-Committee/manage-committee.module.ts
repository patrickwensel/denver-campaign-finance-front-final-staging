import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ManageCommitteeRoutingModule } from './manage-committee-routing.module';
import { ManageCommitteesComponent } from './manage-committees/manage-committees.component';
import { NewCommitteeApproveDenyComponent } from './new-committee-approve-deny/new-committee-approve-deny.component';
import { ExistingCommitteeInfoComponent } from './existing-committee-info/existing-committee-info.component';
import { DashboardModule } from '../Dashboard/dashboard.module';
import { PublicFundingComponent } from './public-funding/public-funding.component';
import { MessagescreenComponent } from './messagescreen/messagescreen.component';
import { NewLobbyistApproveDenyComponent } from './new-lobbyist-approve-deny/new-lobbyist-approve-deny.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { DocumentsComponent } from './documents/documents.component';

@NgModule({
  declarations: [
    ManageCommitteesComponent,
    ExistingCommitteeInfoComponent,
    PublicFundingComponent,
    NewCommitteeApproveDenyComponent,
    MessagescreenComponent,
    NewLobbyistApproveDenyComponent,
    DocumentsComponent],
  imports: [
    CommonModule,
    ManageCommitteeRoutingModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    DashboardModule,
    FlexLayoutModule
  ]
})
export class ManageCommitteeModule { }
