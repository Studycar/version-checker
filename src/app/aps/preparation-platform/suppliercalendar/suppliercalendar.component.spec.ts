import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformSuppliercalendarComponent } from './suppliercalendar.component';

describe('PreparationPlatformSuppliercalendarComponent', () => {
  let component: PreparationPlatformSuppliercalendarComponent;
  let fixture: ComponentFixture<PreparationPlatformSuppliercalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformSuppliercalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformSuppliercalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
