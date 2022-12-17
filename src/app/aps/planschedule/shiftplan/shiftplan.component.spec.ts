import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanscheduleShiftplanComponent } from './shiftplan.component';

describe('PlanscheduleShiftplanComponent', () => {
  let component: PlanscheduleShiftplanComponent;
  let fixture: ComponentFixture<PlanscheduleShiftplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanscheduleShiftplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanscheduleShiftplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
