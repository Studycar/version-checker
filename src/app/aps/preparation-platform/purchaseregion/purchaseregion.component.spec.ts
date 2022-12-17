import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformPurchaseregionComponent } from './purchaseregion.component';

describe('PreparationPlatformPurchaseregionComponent', () => {
  let component: PreparationPlatformPurchaseregionComponent;
  let fixture: ComponentFixture<PreparationPlatformPurchaseregionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformPurchaseregionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformPurchaseregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
