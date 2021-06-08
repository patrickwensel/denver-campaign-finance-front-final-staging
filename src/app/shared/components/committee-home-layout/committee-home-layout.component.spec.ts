import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeHomeLayoutComponent } from './committee-home-layout.component';

describe('CommitteeHomeLayoutComponent', () => {
  let component: CommitteeHomeLayoutComponent;
  let fixture: ComponentFixture<CommitteeHomeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeHomeLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeHomeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
