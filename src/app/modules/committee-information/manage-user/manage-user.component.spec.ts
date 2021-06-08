import { Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonMethods, MasterDataService, ErrorMessageService, MasterUrlService, AuthService, SnackbarService, LocalstorageService } from 'src/app/core';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AuthRoutingModule } from '../../auth/auth-routing.module';
import { ForgotPasswordComponent } from '../../auth/forgot-password/forgot-password.component';
import { LoginComponent } from '../../auth/login/login.component';
import { AdminManageUserComponent } from '../admin-manage-user/admin-manage-user.component';
import { CommitteeInformationDashboardComponent } from '../committee-information-dashboard/committee-information-dashboard.component';
import { CommitteeInformationRoutingModule } from '../committee-information-routing.module';

import { ManageUserComponent } from './manage-user.component';

describe('ManageUserComponent', () => {
  let component: ManageUserComponent;
  let fixture: ComponentFixture<ManageUserComponent>;

  class MockRouterService {
    navigate() {}
  }
  const mockRouterService = new MockRouterService();
  let activatedRouterMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatTabsModule,
        MaterialModule,
      ],
        declarations: [ ManageUserComponent],
        providers:[CommonMethods,MasterDataService,ErrorMessageService,
          {provide: Router, useValue: mockRouterService},
          { provide: ActivatedRoute, useFactory: () => activatedRouterMock},MasterUrlService,AuthService,SnackbarService,
          LocalstorageService,MatSnackBar,Overlay],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
