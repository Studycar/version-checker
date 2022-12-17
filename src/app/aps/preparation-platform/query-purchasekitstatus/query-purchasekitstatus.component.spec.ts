import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformQueryPurchaseKitStatusComponent } from './query-purchasekitstatus.component';

describe('BaseMenumanagerComponent', () => {
  let component: PreparationPlatformQueryPurchaseKitStatusComponent;
  let fixture: ComponentFixture<PreparationPlatformQueryPurchaseKitStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformQueryPurchaseKitStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformQueryPurchaseKitStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
