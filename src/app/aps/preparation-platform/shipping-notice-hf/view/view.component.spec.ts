import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformShippingNoticeHfViewComponent } from './view.component';

describe('PreparationPlatformShippingNoticeHfViewComponent', () => {
  let component: PreparationPlatformShippingNoticeHfViewComponent;
  let fixture: ComponentFixture<PreparationPlatformShippingNoticeHfViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformShippingNoticeHfViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformShippingNoticeHfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
