import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopmaterialpurchasemaintenanceBatchModifyComponent } from './batch-modify.component';

describe('ProductSellBalanceSopmaterialpurchasemaintenanceBatchModifyComponent', () => {
  let component: ProductSellBalanceSopmaterialpurchasemaintenanceBatchModifyComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopmaterialpurchasemaintenanceBatchModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopmaterialpurchasemaintenanceBatchModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopmaterialpurchasemaintenanceBatchModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
