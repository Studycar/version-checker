import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopprodworkdayEditComponent } from './edit.component';

describe('ProductSellBalanceSopprodworkdayEditComponent', () => {
  let component: ProductSellBalanceSopprodworkdayEditComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopprodworkdayEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopprodworkdayEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopprodworkdayEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
