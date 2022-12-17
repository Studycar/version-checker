import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopsuppliercapacitymaintenanceComponent } from './sopsuppliercapacitymaintenance.component';

describe('ProductSellBalanceSopsuppliercapacitymaintenanceComponent', () => {
  let component: ProductSellBalanceSopsuppliercapacitymaintenanceComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopsuppliercapacitymaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopsuppliercapacitymaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopsuppliercapacitymaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
