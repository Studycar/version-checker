import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformShippingNoticeHfNoticeReleaseComponent } from './notice-release.component';

describe('PreparationPlatformShippingNoticeHfNoticeReleaseComponent', () => {
  let component: PreparationPlatformShippingNoticeHfNoticeReleaseComponent;
  let fixture: ComponentFixture<PreparationPlatformShippingNoticeHfNoticeReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformShippingNoticeHfNoticeReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformShippingNoticeHfNoticeReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
