import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopmaterialresourcecorrelationEditComponent } from './edit.component';

describe('ProductSellBalanceSopmaterialresourcecorrelationEditComponent', () => {
  let component: ProductSellBalanceSopmaterialresourcecorrelationEditComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopmaterialresourcecorrelationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductSellBalanceSopmaterialresourcecorrelationEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopmaterialresourcecorrelationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
