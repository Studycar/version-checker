import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessScheduleOperationmanageEditComponent } from './edit.component';

describe('ProcessScheduleOperationmanageEditComponent', () => {
  let component: ProcessScheduleOperationmanageEditComponent;
  let fixture: ComponentFixture<ProcessScheduleOperationmanageEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessScheduleOperationmanageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessScheduleOperationmanageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
