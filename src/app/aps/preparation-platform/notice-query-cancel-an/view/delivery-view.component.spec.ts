import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformDeliveryViewComponent } from './delivery-view.component';

describe('PreparationPlatformDeliveryViewComponent', () => {
  let component: PreparationPlatformDeliveryViewComponent;
  let fixture: ComponentFixture<PreparationPlatformDeliveryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformDeliveryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformDeliveryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
