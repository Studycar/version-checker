import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessScheduleMoprocessMaintenanceReqviewComponent } from './reqview.component';

describe('ProcessScheduleMoprocessMaintenanceReqviewComponent', () => {
  let component: ProcessScheduleMoprocessMaintenanceReqviewComponent;
  let fixture: ComponentFixture<ProcessScheduleMoprocessMaintenanceReqviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessScheduleMoprocessMaintenanceReqviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessScheduleMoprocessMaintenanceReqviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
