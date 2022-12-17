import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningParametersComponent } from './planning-parameters.component';

describe('PlanningParametersComponent', () => {
  let component: PlanningParametersComponent;
  let fixture: ComponentFixture<PlanningParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
