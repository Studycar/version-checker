import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcurrentRequestPlanFormComponent } from './plan-form.component';

describe('PlanFormComponent', () => {
  let component: ConcurrentRequestPlanFormComponent;
  let fixture: ComponentFixture<ConcurrentRequestPlanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestPlanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
