import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoveredOfficialDashboardComponent } from './covered-official-dashboard.component';

describe('CoveredOfficialDashboardComponent', () => {
  let component: CoveredOfficialDashboardComponent;
  let fixture: ComponentFixture<CoveredOfficialDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoveredOfficialDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoveredOfficialDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
