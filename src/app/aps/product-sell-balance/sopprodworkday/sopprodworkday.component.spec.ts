import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopprodworkdayComponent } from './sopprodworkday.component';

describe('ProductSellBalanceSopprodworkdayComponent', () => {
  let component: ProductSellBalanceSopprodworkdayComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopprodworkdayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopprodworkdayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopprodworkdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
