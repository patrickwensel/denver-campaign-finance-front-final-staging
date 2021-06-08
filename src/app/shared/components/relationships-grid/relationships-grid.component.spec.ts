import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipsGridComponent } from './relationships-grid.component';

describe('RelationshipsGridComponent', () => {
  let component: RelationshipsGridComponent;
  let fixture: ComponentFixture<RelationshipsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationshipsGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
