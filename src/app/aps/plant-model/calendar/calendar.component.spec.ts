import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantModelCalendarComponent } from './calendar.component';

describe('PlantModelCalendarComponent', () => {
  let component: PlantModelCalendarComponent;
  let fixture: ComponentFixture<PlantModelCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantModelCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantModelCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
