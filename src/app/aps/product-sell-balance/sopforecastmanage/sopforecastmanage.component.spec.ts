import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopforecastmanageComponent } from './sopforecastmanage.component';

describe('ProductSellBalanceSopforecastmanageComponent', () => {
  let component: ProductSellBalanceSopforecastmanageComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopforecastmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopforecastmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopforecastmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
