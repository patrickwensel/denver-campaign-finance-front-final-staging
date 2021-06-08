import { Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonMethods, MasterDataService, ErrorMessageService, MasterUrlService, AuthService, SnackbarService, LocalstorageService } from 'src/app/core';
import { MaterialModule } from 'src/app/shared/modules/material.module';

import { CommitteeInformationDashboardComponent } from './committee-information-dashboard.component';

describe('CommitteeInformationDashboardComponent', () => {
  let component: CommitteeInformationDashboardComponent;
  let fixture: ComponentFixture<CommitteeInformationDashboardComponent>;
  class MockRouterService {
    navigate() {}
  }
  const mockRouterService = new MockRouterService();
  let activatedRouterMock;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeInformationDashboardComponent ],
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
      providers:[CommonMethods,MasterDataService,ErrorMessageService,
        {provide: Router, useValue: mockRouterService},
        { provide: ActivatedRoute, useFactory: () => activatedRouterMock},MasterUrlService,AuthService,SnackbarService,
        LocalstorageService,MatSnackBar,Overlay],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeInformationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
