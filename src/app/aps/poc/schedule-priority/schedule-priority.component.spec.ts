import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePriorityComponent } from './schedule-priority.component';

describe('SchedulePriorityComponent', () => {
  let component: SchedulePriorityComponent;
  let fixture: ComponentFixture<SchedulePriorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulePriorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
