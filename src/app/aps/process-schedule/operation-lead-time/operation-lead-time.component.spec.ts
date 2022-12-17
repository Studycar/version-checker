import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessScheduleOperationLeadTimeComponent } from './operation-lead-time.component';

describe('ProcessScheduleOperationLeadTimeComponent', () => {
  let component: ProcessScheduleOperationLeadTimeComponent;
  let fixture: ComponentFixture<ProcessScheduleOperationLeadTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessScheduleOperationLeadTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessScheduleOperationLeadTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
