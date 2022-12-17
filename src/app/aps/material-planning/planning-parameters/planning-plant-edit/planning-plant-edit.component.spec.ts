import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningPlantEditComponent } from './planning-plant-edit.component';

describe('PlanningPlantEditComponent', () => {
  let component: PlanningPlantEditComponent;
  let fixture: ComponentFixture<PlanningPlantEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningPlantEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningPlantEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
