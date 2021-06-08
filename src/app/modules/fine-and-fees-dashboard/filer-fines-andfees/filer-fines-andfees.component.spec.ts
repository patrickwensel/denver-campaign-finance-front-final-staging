import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilerFinesAndfeesComponent } from './filer-fines-andfees.component';

describe('FilerFinesAndfeesComponent', () => {
  let component: FilerFinesAndfeesComponent;
  let fixture: ComponentFixture<FilerFinesAndfeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilerFinesAndfeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilerFinesAndfeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
