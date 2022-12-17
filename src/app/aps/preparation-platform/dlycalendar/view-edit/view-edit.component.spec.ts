import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformDlycalendarViewEditComponent } from './view-edit.component';

describe('PreparationPlatformDlycalendarViewEditComponent', () => {
  let component: PreparationPlatformDlycalendarViewEditComponent;
  let fixture: ComponentFixture<PreparationPlatformDlycalendarViewEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformDlycalendarViewEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformDlycalendarViewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
