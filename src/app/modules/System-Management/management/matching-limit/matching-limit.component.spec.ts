import { Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Router } from '@angular/router';
import { CommonMethods, MasterDataService, ErrorMessageService, MasterUrlService, AuthService, LocalstorageService, SnackbarService } from 'src/app/core';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

import { MatchingLimitComponent } from './matching-limit.component';

describe('MatchingLimitComponent', () => {
  let component: MatchingLimitComponent;
  let fixture: ComponentFixture<MatchingLimitComponent>;
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
        BrowserAnimationsModule,
        MaterialModule,
        SharedModule,
      ],
      declarations: [ MatchingLimitComponent ],
      providers:[CommonMethods,MasterDataService,ErrorMessageService,MasterUrlService,
        AuthService,{provide: Router, useValue: mockRouterService},LocalstorageService,
        SnackbarService,MatSnackBar,Overlay],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchingLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    component.publicfunding.controls.election_cycle.setValue('');
    component.publicfunding.controls.start_date.setValue('');
    component.publicfunding.controls.end_date.setValue('');
    component.publicfunding.controls.qualifying_offices.setValue([]);
    component.publicfunding.controls.available.setValue('');
    component.publicfunding.controls.ratio.setValue('');
    component.publicfunding.controls.qualifying_contribution.setValue('');
    component.publicfunding.controls.number_of_req.setValue('');
    component.publicfunding.controls.contr_limit.setValue('');
    component.publicfunding.controls.contr_amount.setValue('');
    expect(component.publicfunding.valid).toBeFalsy();
    });
    it('form valid', () => {
      component.publicfunding.controls.election_cycle.setValue('gthg');
      component.publicfunding.controls.start_date.setValue('gthg');
      component.publicfunding.controls.end_date.setValue('gthg');
      component.publicfunding.controls.qualifying_offices.setValue([1, 2]);
      component.publicfunding.controls.available.setValue('gthg');
      component.publicfunding.controls.ratio.setValue('gthg');
      component.publicfunding.controls.qualifying_contribution.setValue('gthg');
      component.publicfunding.controls.number_of_req.setValue('gthg');
      component.publicfunding.controls.contr_limit.setValue('gthg');
      component.publicfunding.controls.contr_amount.setValue('gthg');
    expect(component.publicfunding.valid).toBeFalsy();
    });
});
