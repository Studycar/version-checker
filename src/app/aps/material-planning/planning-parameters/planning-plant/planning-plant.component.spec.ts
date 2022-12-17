import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningPlantComponent } from './planning-plant.component';

describe('PlanningPlantComponent', () => {
  let component: PlanningPlantComponent;
  let fixture: ComponentFixture<PlanningPlantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningPlantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningPlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
