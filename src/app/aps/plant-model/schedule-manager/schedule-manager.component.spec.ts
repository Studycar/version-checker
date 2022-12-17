import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantModelScheduleManagerComponent } from './schedule-manager.component';

describe('PlantModelScheduleManagerComponent', () => {
  let component: PlantModelScheduleManagerComponent;
  let fixture: ComponentFixture<PlantModelScheduleManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantModelScheduleManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantModelScheduleManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
