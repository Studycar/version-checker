import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformDlycalendarViewComponent } from './view.component';

describe('PreparationPlatformDlycalendarViewComponent', () => {
  let component: PreparationPlatformDlycalendarViewComponent;
  let fixture: ComponentFixture<PreparationPlatformDlycalendarViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformDlycalendarViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformDlycalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
