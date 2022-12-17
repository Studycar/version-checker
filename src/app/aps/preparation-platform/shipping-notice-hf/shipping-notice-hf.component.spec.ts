import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformShippingNoticeHfComponent } from './shipping-notice-hf.component';

describe('PreparationPlatformShippingNoticeHfComponent', () => {
  let component: PreparationPlatformShippingNoticeHfComponent;
  let fixture: ComponentFixture<PreparationPlatformShippingNoticeHfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformShippingNoticeHfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformShippingNoticeHfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
