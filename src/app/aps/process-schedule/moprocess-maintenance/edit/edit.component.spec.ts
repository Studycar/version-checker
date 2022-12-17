import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessScheduleMoprocessMaintenanceEditComponent } from './edit.component';

describe('ProcessScheduleMoprocessMaintenanceEditComponent', () => {
  let component: ProcessScheduleMoprocessMaintenanceEditComponent;
  let fixture: ComponentFixture<ProcessScheduleMoprocessMaintenanceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessScheduleMoprocessMaintenanceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessScheduleMoprocessMaintenanceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
