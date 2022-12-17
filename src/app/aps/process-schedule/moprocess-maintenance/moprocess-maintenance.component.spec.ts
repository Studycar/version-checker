import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessScheduleMOProcessMaintenanceComponent } from './moprocess-maintenance.component';

describe('ProcessScheduleMOProcessMaintenanceComponent', () => {
  let component: ProcessScheduleMOProcessMaintenanceComponent;
  let fixture: ComponentFixture<ProcessScheduleMOProcessMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessScheduleMOProcessMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessScheduleMOProcessMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
