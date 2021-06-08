import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeTreasurerPopUpComponent } from './make-treasurer-pop-up.component';

describe('MakeTreasurerPopUpComponent', () => {
  let component: MakeTreasurerPopUpComponent;
  let fixture: ComponentFixture<MakeTreasurerPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeTreasurerPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeTreasurerPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
