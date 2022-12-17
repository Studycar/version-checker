import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformShippingNoticeHfAutoCalculateChooseComponent } from './auto-calculate-choose.component';

describe('PreparationPlatformShippingNoticeHfAutoCalculateChooseComponent', () => {
  let component: PreparationPlatformShippingNoticeHfAutoCalculateChooseComponent;
  let fixture: ComponentFixture<PreparationPlatformShippingNoticeHfAutoCalculateChooseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformShippingNoticeHfAutoCalculateChooseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformShippingNoticeHfAutoCalculateChooseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
