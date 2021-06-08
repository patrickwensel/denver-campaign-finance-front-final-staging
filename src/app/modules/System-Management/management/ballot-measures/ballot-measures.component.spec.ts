import { Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Router, ActivatedRoute, ChildrenOutletContexts } from '@angular/router';
import { CommonMethods, MasterDataService, ErrorMessageService, MasterUrlService, AuthService, LocalstorageService, SnackbarService, MasterRoleService } from 'src/app/core';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

import { BallotMeasuresComponent } from './ballot-measures.component';

describe('BallotMeasuresComponent', () => {
  let component: BallotMeasuresComponent;
  let fixture: ComponentFixture<BallotMeasuresComponent>;
  class MockRouterService {
    navigate() {}
  }
  const mockRouterService = new MockRouterService();
  let activatedRouterMock;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports:[
          HttpClientModule,
          CommonModule,
          FormsModule,
          ReactiveFormsModule,
          RouterModule,
          BrowserAnimationsModule,
          MaterialModule,
          SharedModule,
        ],
        declarations: [ BallotMeasuresComponent ],
        providers:[CommonMethods,MasterDataService,ErrorMessageService,{provide: Router, useValue: mockRouterService},
          MasterUrlService,AuthService,LocalstorageService,SnackbarService,MatSnackBar,{provide: MatDialogRef, useValue: {}},
          Overlay,{ provide: ActivatedRoute, useFactory: () => activatedRouterMock},{ provide: MAT_DIALOG_DATA, useValue: {} },
          ChildrenOutletContexts,MasterRoleService],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotMeasuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    component.ballotIssueForm.controls.issueNumber.setValue('');
    component.ballotIssueForm.controls.issueName.setValue('');
    component.ballotIssueForm.controls.description.setValue('');
    component.ballotIssueForm.controls.electionCycle.setValue('');
    expect(component.ballotIssueForm.valid).toBeFalsy();
    });
    it('form valid', () => {
      component.ballotIssueForm.controls.issueNumber.setValue('gthg');
      component.ballotIssueForm.controls.issueName.setValue('cd');
      component.ballotIssueForm.controls.description.setValue('cds');
      component.ballotIssueForm.controls.electionCycle.setValue('csd');
    expect(component.ballotIssueForm.valid).toBeTruthy();
    });
});
