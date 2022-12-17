import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformShippingNoticeHfDataCheckComponent } from './data-check.component';

describe('PreparationPlatformShippingNoticeHfDataCheckComponent', () => {
  let component: PreparationPlatformShippingNoticeHfDataCheckComponent;
  let fixture: ComponentFixture<PreparationPlatformShippingNoticeHfDataCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformShippingNoticeHfDataCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformShippingNoticeHfDataCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
