import { Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ChildrenOutletContexts, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonMethods, MasterDataService, ErrorMessageService, MasterUrlService, AuthService, LocalstorageService, SnackbarService, MasterRoleService } from 'src/app/core';

import { NewLobbyistApproveDenyComponent } from './new-lobbyist-approve-deny.component';

describe('NewLobbyistApproveDenyComponent', () => {
  let component: NewLobbyistApproveDenyComponent;
  let fixture: ComponentFixture<NewLobbyistApproveDenyComponent>;
  let activatedRouterMock;
  class MockRouterService {
    navigate() {}
  }

  const mockRouterService = new MockRouterService();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        BrowserAnimationsModule,
      ],
      declarations: [ NewLobbyistApproveDenyComponent ],
      providers:[CommonMethods,MasterDataService,ErrorMessageService,{provide: Router, useValue: mockRouterService},
        MasterUrlService,AuthService,LocalstorageService,SnackbarService,MatSnackBar,{provide: MatDialogRef, useValue: {}},
        Overlay,{ provide: MAT_DIALOG_DATA, useValue: {} },
        ChildrenOutletContexts,MasterRoleService,
        { provide: ActivatedRoute, useFactory: () => activatedRouterMock}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLobbyistApproveDenyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
