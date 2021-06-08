import { Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService, CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';

import { LobbyistSubcontractorsComponent } from './lobbyist-subcontractors.component';
import { KeyPreventDirective } from 'src/app/shared/directives/prevent-key-typing.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('LobbyistSubcontractorsComponent', () => {
  let component: LobbyistSubcontractorsComponent;
  let fixture: ComponentFixture<LobbyistSubcontractorsComponent>;
  let activatedRouterMock;
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
        MatTableModule,
        MatDialogModule,
        MatIconModule,
        MatSelectModule,
        MatAutocompleteModule
      ],
      declarations: [ LobbyistSubcontractorsComponent, KeyPreventDirective ],
      providers:[CommonMethods,MasterDataService,ErrorMessageService,{provide: Router, useValue: mockRouterService},
        MasterUrlService,AuthService,LocalstorageService,SnackbarService,MatSnackBar,{provide: MatDialogRef, useValue: {}},
        Overlay,{ provide: ActivatedRoute, useFactory: () => activatedRouterMock}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyistSubcontractorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('form invalid when empty', () => {
    component.LobbySubcontractorsForm.controls.type.setValue('');
    component.LobbySubcontractorsForm.controls.subcontractorName.setValue('');
    component.LobbySubcontractorsForm.controls.phone.setValue('');
    component.LobbySubcontractorsForm.controls.email.setValue('');
    expect(component.LobbySubcontractorsForm.valid).toBeFalsy();
  });

});
