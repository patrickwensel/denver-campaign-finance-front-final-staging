import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingContributionComponent } from './matching-contribution.component';

describe('MatchingContributionComponent', () => {
  let component: MatchingContributionComponent;
  let fixture: ComponentFixture<MatchingContributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchingContributionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchingContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
