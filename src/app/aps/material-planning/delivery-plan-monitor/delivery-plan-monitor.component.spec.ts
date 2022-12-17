import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPlanMonitorComponent } from './delivery-plan-monitor.component';

describe('DeliveryPlanMonitorComponent', () => {
  let component: DeliveryPlanMonitorComponent;
  let fixture: ComponentFixture<DeliveryPlanMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryPlanMonitorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryPlanMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
