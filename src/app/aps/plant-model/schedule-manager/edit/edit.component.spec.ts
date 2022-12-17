import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantModelScheduleManagerEditComponent } from './edit.component';

describe('PlantModelScheduleManagerEditComponent', () => {
  let component: PlantModelScheduleManagerEditComponent;
  let fixture: ComponentFixture<PlantModelScheduleManagerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantModelScheduleManagerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantModelScheduleManagerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
