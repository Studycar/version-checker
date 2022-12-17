import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopforecastmanageEditComponent } from './edit.component';

describe('ProductSellBalanceSopforecastmanageEditComponent', () => {
  let component: ProductSellBalanceSopforecastmanageEditComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopforecastmanageEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopforecastmanageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopforecastmanageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
