import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Router } from '@angular/router';
import { CommonMethods, ErrorMessageService, SnackbarService, MasterUrlService, MasterDataService, AuthService, LocalstorageService } from 'src/app/core';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

import { FilingPeriodComponent } from './filing-period.component';

describe('FilingPeriodComponent', () => {
  let component: FilingPeriodComponent;
  let fixture: ComponentFixture<FilingPeriodComponent>;
  let commonMethods: CommonMethods;
  let errorService: ErrorMessageService;
  let snackbar: SnackbarService;
  let dialog: MatDialog;
  let service;
  let masterDate;
  let urlService: MasterUrlService;
  let location;
  class MockRouterService {
    navigate() {}
  }
  const mockRouterService = new MockRouterService();
  component = new FilingPeriodComponent(
    commonMethods,errorService,snackbar,dialog,service,masterDate,urlService,location
  )
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterModule,
        MaterialModule,
        SharedModule,
      ],
      declarations: [ FilingPeriodComponent ],
      providers:[CommonMethods,MasterDataService,ErrorMessageService,{provide: Router, useValue: mockRouterService},{provide: APP_BASE_HREF, useValue : '/' },
      MasterUrlService,AuthService,LocalstorageService,SnackbarService,MatSnackBar],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilingPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
