import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessScheduleOperationmanageComponent } from './operationmanage.component';

describe('ProcessScheduleOperationmanageComponent', () => {
  let component: ProcessScheduleOperationmanageComponent;
  let fixture: ComponentFixture<ProcessScheduleOperationmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessScheduleOperationmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessScheduleOperationmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
