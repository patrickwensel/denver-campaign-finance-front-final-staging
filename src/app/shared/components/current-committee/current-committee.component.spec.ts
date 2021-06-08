import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentCommitteeComponent } from './current-committee.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../modules/shared.module';
import { MasterDataService, ErrorMessageService, MasterUrlService, SnackbarService, LocalstorageService, CommonMethods } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';

describe('CurrentCommitteeComponent', () => {
  let component: CurrentCommitteeComponent;
  let fixture: ComponentFixture<CurrentCommitteeComponent>;

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
      providers: [CommonMethods,
        MasterDataService,ErrorMessageService, ClientService, MasterUrlService,SnackbarService, LocalstorageService
      ],
      declarations: [ CurrentCommitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
