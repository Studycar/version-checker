import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopmaterialresourcecorrelationComponent } from './sopmaterialresourcecorrelation.component';

describe('ProductSellBalanceSopmaterialresourcecorrelationComponent', () => {
  let component: ProductSellBalanceSopmaterialresourcecorrelationComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopmaterialresourcecorrelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductSellBalanceSopmaterialresourcecorrelationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopmaterialresourcecorrelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
