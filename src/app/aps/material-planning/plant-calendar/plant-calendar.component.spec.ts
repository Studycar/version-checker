import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantCalendarComponent } from './plant-calendar.component';

describe('PlantCalendarComponent', () => {
  let component: PlantCalendarComponent;
  let fixture: ComponentFixture<PlantCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
