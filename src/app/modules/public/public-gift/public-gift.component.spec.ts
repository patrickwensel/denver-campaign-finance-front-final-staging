import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Router } from '@angular/router';
import { CommonMethods, MasterDataService, ErrorMessageService, MasterUrlService, AuthService, LocalstorageService, SnackbarService } from 'src/app/core';

import { PublicGiftComponent } from './public-gift.component';

describe('PublicGiftComponent', () => {
  let component: PublicGiftComponent;
  let fixture: ComponentFixture<PublicGiftComponent>;
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
        MatIconModule,
        MatDialogModule,
        MatTableModule,
        MatCheckboxModule
      ],
      declarations: [ PublicGiftComponent ],
      providers:[CommonMethods,MasterDataService,ErrorMessageService,{provide: Router, useValue: mockRouterService},
        MasterUrlService,AuthService,LocalstorageService,SnackbarService,MatSnackBar],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
