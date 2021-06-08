import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsUnpaidoblicationComponent } from './transactions-unpaidoblication.component';

describe('TransactionsUnpaidoblicationComponent', () => {
  let component: TransactionsUnpaidoblicationComponent;
  let fixture: ComponentFixture<TransactionsUnpaidoblicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionsUnpaidoblicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsUnpaidoblicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
