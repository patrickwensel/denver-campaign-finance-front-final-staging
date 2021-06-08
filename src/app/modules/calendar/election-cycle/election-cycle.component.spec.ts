import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService, CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

import { ElectionCycleComponent } from './election-cycle.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from 'src/app/core/api-services/client.service';
import { AppModule } from 'src/app/app.module';

describe('ElectionCycleComponent', () => {
  let component: ElectionCycleComponent;
  let fixture: ComponentFixture<ElectionCycleComponent>;
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
  component = new ElectionCycleComponent(
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
      declarations: [ ElectionCycleComponent ],
      providers:[CommonMethods,MasterDataService,ErrorMessageService,{provide: Router, useValue: mockRouterService},{provide: APP_BASE_HREF, useValue : '/' },
        MasterUrlService,AuthService,LocalstorageService,SnackbarService,MatSnackBar],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectionCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    component.electionCycle.controls.title.setValue('');
    component.electionCycle.controls.description.setValue('');
    component.electionCycle.controls.election_type.setValue('');
    component.electionCycle.controls.offices.setValue('');
    component.electionCycle.controls.district.setValue('');
    component.electionCycle.controls.Ec_start_date.setValue('');
    component.electionCycle.controls.Ec_end_date.setValue('');
    component.electionCycle.controls.Ie_start_date.setValue('');
    component.electionCycle.controls.Ie_end_date.setValue('');
    component.electionCycle.controls.status.setValue('');
    component.electionCycle.controls.election_date.setValue('');
    expect(component.electionCycle.valid).toBeFalsy();
    });
    it('form invalid with wrong data', () => {
      component.electionCycle.controls.title.setValue('gthg');
      component.electionCycle.controls.description.setValue('cd');
      component.electionCycle.controls.election_type.setValue('cds');
      component.electionCycle.controls.offices.setValue('csd');
      component.electionCycle.controls.district.setValue('sdc');
      component.electionCycle.controls.Ec_start_date.setValue('csd');
      component.electionCycle.controls.Ec_end_date.setValue('sdcd');
      component.electionCycle.controls.Ie_start_date.setValue('csd');
      component.electionCycle.controls.Ie_end_date.setValue('scd');
      component.electionCycle.controls.status.setValue('csd');
      component.electionCycle.controls.election_date.setValue('csd');
    expect(component.electionCycle.valid).toBeFalsy();
    });


    // test('should set submitted to true', () => {
    // component.addfunc();
    // expect(component.submitted).toBeTruthy();
    // });
});
