import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';

import { LoansGridComponent } from './loans-grid.component';

describe('LoansGridComponent', () => {
  let component: LoansGridComponent;
  let fixture: ComponentFixture<LoansGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        MatTableModule
      ],
      declarations: [ LoansGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
