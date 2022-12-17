import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformDlycalendarComponent } from './dlycalendar.component';

describe('PreparationPlatformDlycalendarComponent', () => {
  let component: PreparationPlatformDlycalendarComponent;
  let fixture: ComponentFixture<PreparationPlatformDlycalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformDlycalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformDlycalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
