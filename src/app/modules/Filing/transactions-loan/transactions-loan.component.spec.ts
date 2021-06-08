import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsLoanComponent } from './transactions-loan.component';

describe('TransactionsLoanComponent', () => {
  let component: TransactionsLoanComponent;
  let fixture: ComponentFixture<TransactionsLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionsLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
