import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityitemsReportComponent } from './cityitems-report.component';

describe('CityitemsReportComponent', () => {
  let component: CityitemsReportComponent;
  let fixture: ComponentFixture<CityitemsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityitemsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityitemsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
