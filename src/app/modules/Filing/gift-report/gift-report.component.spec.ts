import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftReportComponent } from './gift-report.component';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { KeyPreventDirective } from 'src/app/shared/directives/prevent-key-typing.directive';
import { CommonMethods } from 'src/app/core';

describe('GiftReportComponent', () => {
  let component: GiftReportComponent;
  let fixture: ComponentFixture<GiftReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatSelectModule,
        MatCheckboxModule
      ],
      declarations: [ GiftReportComponent, KeyPreventDirective],
      providers: [CommonMethods]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
