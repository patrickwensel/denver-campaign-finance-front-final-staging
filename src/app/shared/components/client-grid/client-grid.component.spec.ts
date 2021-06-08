import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientGridComponent } from './client-grid.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonMethods, MasterDataService, ErrorMessageService, MasterUrlService, AuthService, LocalstorageService, SnackbarService } from 'src/app/core';

describe('ClientGridComponent', () => {
  let component: ClientGridComponent;
  let fixture: ComponentFixture<ClientGridComponent>;
  class MockRouterService {
    navigate() {}
  }
  const mockRouterService = new MockRouterService();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTabsModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatSelectModule,
      ],
      declarations: [ ClientGridComponent ],
      providers:[CommonMethods,MasterDataService,ErrorMessageService,{provide: Router, useValue: mockRouterService},
        MasterUrlService,AuthService,LocalstorageService,SnackbarService,MatSnackBar],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
