import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RoutingPlanningComponent } from './routing-planning.component';

describe('RoutingPlanningComponent', () => {
  let component: RoutingPlanningComponent;
  let fixture: ComponentFixture<RoutingPlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutingPlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutingPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
