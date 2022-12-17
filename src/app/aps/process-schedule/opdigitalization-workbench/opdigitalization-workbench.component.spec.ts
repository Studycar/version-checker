import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessScheduleOpdigitalizationWorkbenchComponent } from './opdigitalization-workbench.component';

describe('ProcessScheduleOpdigitalizationWorkbenchComponent', () => {
  let component: ProcessScheduleOpdigitalizationWorkbenchComponent;
  let fixture: ComponentFixture<ProcessScheduleOpdigitalizationWorkbenchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessScheduleOpdigitalizationWorkbenchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessScheduleOpdigitalizationWorkbenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
