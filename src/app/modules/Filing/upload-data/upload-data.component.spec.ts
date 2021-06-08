import { Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { AuthService, CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';

import { UploadDataComponent } from './upload-data.component';

describe('UploadDataComponent', () => {
  let component: UploadDataComponent;
  let fixture: ComponentFixture<UploadDataComponent>;
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
        MatInputModule,
        BrowserAnimationsModule

      ],
      declarations: [ UploadDataComponent ],
      providers:[CommonMethods,MasterDataService,ErrorMessageService,{provide: Router, useValue: mockRouterService},
        MasterUrlService,AuthService,LocalstorageService,SnackbarService,MatSnackBar,Overlay],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
