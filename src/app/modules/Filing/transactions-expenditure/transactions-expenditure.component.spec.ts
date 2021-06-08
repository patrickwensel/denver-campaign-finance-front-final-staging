import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsExpenditureComponent } from './transactions-expenditure.component';

describe('TransactionsExpenditureComponent', () => {
  let component: TransactionsExpenditureComponent;
  let fixture: ComponentFixture<TransactionsExpenditureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionsExpenditureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
