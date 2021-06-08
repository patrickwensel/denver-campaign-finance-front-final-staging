import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineAndFeesComponent } from './fine-and-fees.component';
import { CommonMethods } from 'src/app/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { By } from '@angular/platform-browser';

describe('FineAndFeesComponent', () => {
  let component: FineAndFeesComponent;
  let fixture: ComponentFixture<FineAndFeesComponent>;
  let commonMock: CommonMethods;
  let formBuilderMock: FormBuilder;


  component = new FineAndFeesComponent(commonMock, formBuilderMock );
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FineAndFeesComponent ],
      imports: [
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
        SharedModule,
        MaterialModule
      ],
      providers: [
        CommonMethods,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FineAndFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
 

 

test('form invalid when empty', () => {
  component.transactionform.controls.invoice_number.setValue('');
  component.transactionform.controls.type.setValue('');
  component.transactionform.controls.description.setValue('');
  component.transactionform.controls.amount.setValue('');
  component.transactionform.controls.user.setValue('');
  component.transactionform.controls.payment_method.setValue('');
  expect(component.transactionform.valid).toBeFalsy();
});
test('form valid', () => {
  component.transactionform.controls.invoice_number.setValue('');
  component.transactionform.controls.type.setValue('test');
  component.transactionform.controls.description.setValue('teststring');
  component.transactionform.controls.amount.setValue('');
  component.transactionform.controls.user.setValue('');
  component.transactionform.controls.payment_method.setValue('');
  expect(component.transactionform.valid).toBeTruthy();
})

test(' DEscription form validation', () => {
  component.transactionform.controls.invoice_number.setValue('');
  component.transactionform.controls.type.setValue('test');
  component.transactionform.controls.description.setValue('tyu');
  component.transactionform.controls.amount.setValue('');
  component.transactionform.controls.user.setValue('');
  component.transactionform.controls.payment_method.setValue('');
  expect(component.transactionform.valid).toBeTruthy();
})
 

test('should set submitted to true', () => {
  component.addfunc();
  expect(component.submitted).toBeTruthy();
});

 

});
