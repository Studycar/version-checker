import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopmaterialpurchasemaintenanceComponent } from './sopmaterialpurchasemaintenance.component';

describe('ProductSellBalanceSopmaterialpurchasemaintenanceComponent', () => {
  let component: ProductSellBalanceSopmaterialpurchasemaintenanceComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopmaterialpurchasemaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopmaterialpurchasemaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopmaterialpurchasemaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
