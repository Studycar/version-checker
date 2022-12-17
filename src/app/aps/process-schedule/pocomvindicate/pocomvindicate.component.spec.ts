import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessSchedulePoComVindicateComponent } from './pocomvindicate.component';

describe('MaterialmanagementMaterialmaintenanceComponent', () => {
  let component: ProcessSchedulePoComVindicateComponent;
  let fixture: ComponentFixture<ProcessSchedulePoComVindicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessSchedulePoComVindicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessSchedulePoComVindicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
