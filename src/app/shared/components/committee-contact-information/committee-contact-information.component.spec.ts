import { Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { AuthService, CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';

import { CommitteeContactInformationComponent } from './committee-contact-information.component';
import { KeyPreventDirective } from '../../directives/prevent-key-typing.directive';

describe('CommitteeContactInformationComponent', () => {
  let component: CommitteeContactInformationComponent;
  let fixture: ComponentFixture<CommitteeContactInformationComponent>;
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
        MatSelectModule
      ],
      declarations: [ CommitteeContactInformationComponent, KeyPreventDirective ],
      providers:[CommonMethods,MasterDataService,ErrorMessageService,{provide: Router, useValue: mockRouterService},
        MasterUrlService,AuthService,LocalstorageService,SnackbarService,MatSnackBar,{provide: MatDialogRef, useValue: {}},
        Overlay],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeContactInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  test('form invalid when empty', () => {
    component.createCommitteeInformationForm.controls.address1.setValue('');
    component.createCommitteeInformationForm.controls.address2.setValue('');
    component.createCommitteeInformationForm.controls.city.setValue('');
    component.createCommitteeInformationForm.controls.campPhone.setValue('');
    component.createCommitteeInformationForm.controls.state.setValue('');
    component.createCommitteeInformationForm.controls.zipCode.setValue('');
    component.createCommitteeInformationForm.controls.campEmail.setValue('');
    component.createCommitteeInformationForm.controls.altPhone.setValue('');
    component.createCommitteeInformationForm.controls.altEmail.setValue('');
    component.createCommitteeInformationForm.controls.commWebsite.setValue('');
    expect(component.createCommitteeInformationForm.valid).toBeFalsy();
  });


});
