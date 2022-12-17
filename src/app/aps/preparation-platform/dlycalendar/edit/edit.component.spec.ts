import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformDlycalendarEditComponent } from './edit.component';

describe('PreparationPlatformDlycalendarEditComponent', () => {
  let component: PreparationPlatformDlycalendarEditComponent;
  let fixture: ComponentFixture<PreparationPlatformDlycalendarEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformDlycalendarEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformDlycalendarEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
