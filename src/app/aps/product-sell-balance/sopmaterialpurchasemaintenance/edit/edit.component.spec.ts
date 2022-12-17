import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopmaterialpurchasemaintenanceEditComponent } from './edit.component';

describe('ProductSellBalanceSopmaterialpurchasemaintenanceEditComponent', () => {
  let component: ProductSellBalanceSopmaterialpurchasemaintenanceEditComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopmaterialpurchasemaintenanceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopmaterialpurchasemaintenanceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopmaterialpurchasemaintenanceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
