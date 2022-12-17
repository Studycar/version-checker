import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformSuppliercalendarEditComponent } from './edit.component';

describe('PreparationPlatformSuppliercalendarEditComponent', () => {
  let component: PreparationPlatformSuppliercalendarEditComponent;
  let fixture: ComponentFixture<PreparationPlatformSuppliercalendarEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformSuppliercalendarEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformSuppliercalendarEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
