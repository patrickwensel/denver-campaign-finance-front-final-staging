import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyComponent } from './modify.component';
import { SharedModule } from '../../modules/shared.module';
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
import { MatIconModule } from '@angular/material/icon';
import { CommonMethods } from 'src/app/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ModifyComponent', () => {
  let component: ModifyComponent;
  let fixture: ComponentFixture<ModifyComponent>;

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
        MatIconModule,
        MatSnackBarModule
      ],
      declarations: [ ModifyComponent ],
      providers:
      [
        CommonMethods
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
