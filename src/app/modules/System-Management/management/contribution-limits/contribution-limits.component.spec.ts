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

import { ContributionLimitsComponent } from './contribution-limits.component';

describe('ContributionLimitsComponent', () => {
  let component: ContributionLimitsComponent;
  let fixture: ComponentFixture<ContributionLimitsComponent>;
  class MockRouterService {
    navigate() {}
  }
  const mockRouterService = new MockRouterService();
  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports:[
        HttpClientModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatSelectModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatTableModule
      ],
      declarations: [ ContributionLimitsComponent ],
      providers:[CommonMethods,MasterDataService,ErrorMessageService,{provide: Router, useValue: mockRouterService},
        MasterUrlService,AuthService,LocalstorageService,SnackbarService,MatSnackBar,{provide: MatDialogRef, useValue: {}},
        Overlay,{ provide: MAT_DIALOG_DATA, useValue: {} },
        ChildrenOutletContexts,MasterRoleService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributionLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    component.contribution.controls.filer_type.setValue('');
    component.contribution.controls.office.setValue('');
    component.contribution.controls.donar_type.setValue('');
    component.contribution.controls.contribution_limit.setValue('');
    component.contribution.controls.elect_cycle.setValue('');
    expect(component.contribution.valid).toBeFalsy();
    });
    it('form valid', () => {
    component.contribution.controls.filer_type.setValue([1, 2,]);
    component.contribution.controls.office.setValue([1, 2,]);
    component.contribution.controls.donar_type.setValue('cds');
    component.contribution.controls.contribution_limit.setValue('csd');
    component.contribution.controls.elect_cycle.setValue('csd');
    expect(component.contribution.valid).toBeTruthy();
    });

});
