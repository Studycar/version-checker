import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulingCapacityTrendComponent } from './scheduling-capacity-trend.component';

describe('SchedulingCapacityTrendComponent', () => {
  let component: SchedulingCapacityTrendComponent;
  let fixture: ComponentFixture<SchedulingCapacityTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulingCapacityTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulingCapacityTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
