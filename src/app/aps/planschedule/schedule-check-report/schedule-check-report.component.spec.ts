import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleCheckReportComponent } from './schedule-check-report.component';

describe('ScheduleCheckReportComponent', () => {
  let component: ScheduleCheckReportComponent;
  let fixture: ComponentFixture<ScheduleCheckReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleCheckReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleCheckReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});