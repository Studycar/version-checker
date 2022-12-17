import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopsuppliercapacitymaintenanceEditComponent } from './edit.component';

describe('ProductSellBalanceSopsuppliercapacitymaintenanceEditComponent', () => {
  let component: ProductSellBalanceSopsuppliercapacitymaintenanceEditComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopsuppliercapacitymaintenanceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopsuppliercapacitymaintenanceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopsuppliercapacitymaintenanceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
