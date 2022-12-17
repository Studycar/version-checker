import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessScheduleMoprocessMaintenanceViewComponent } from './view.component';

describe('ProcessScheduleMoprocessMaintenanceViewComponent', () => {
  let component: ProcessScheduleMoprocessMaintenanceViewComponent;
  let fixture: ComponentFixture<ProcessScheduleMoprocessMaintenanceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessScheduleMoprocessMaintenanceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessScheduleMoprocessMaintenanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
