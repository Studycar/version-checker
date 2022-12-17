import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopforecastmanageDetailComponent } from './detail.component';

describe('ProductSellBalanceSopforecastmanageDetailComponent', () => {
  let component: ProductSellBalanceSopforecastmanageDetailComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopforecastmanageDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopforecastmanageDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopforecastmanageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
