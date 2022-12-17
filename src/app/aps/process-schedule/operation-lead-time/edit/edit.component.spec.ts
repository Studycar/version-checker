import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessScheduleOperationLeadTimeEditComponent } from './edit.component';

describe('ProcessScheduleOperationLeadTimeEditComponent', () => {
  let component: ProcessScheduleOperationLeadTimeEditComponent;
  let fixture: ComponentFixture<ProcessScheduleOperationLeadTimeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessScheduleOperationLeadTimeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessScheduleOperationLeadTimeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
