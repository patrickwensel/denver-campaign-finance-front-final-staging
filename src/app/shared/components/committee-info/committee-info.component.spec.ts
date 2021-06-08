import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeInfoComponent } from './committee-info.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../modules/shared.module';
import { CommonMethods, MasterUrlService, SnackbarService, MasterDataService, LocalstorageService, AuthService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('CommitteeInfoComponent', () => {
  let component: CommitteeInfoComponent;
  let fixture: ComponentFixture<CommitteeInfoComponent>;

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
        MatSnackBarModule
      ],
      providers: [
        CommonMethods,ClientService,MasterUrlService,SnackbarService,AuthService, MasterDataService, LocalstorageService, {provide: Router, useValue: mockRouterService}
      ],
      declarations: [ CommitteeInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
