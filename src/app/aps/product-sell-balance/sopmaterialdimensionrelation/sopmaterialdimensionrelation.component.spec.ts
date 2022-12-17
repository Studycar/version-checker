import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopmaterialdimensionrelationComponent } from './sopmaterialdimensionrelation.component';

describe('ProductSellBalanceSopmaterialdimensionrelationComponent', () => {
  let component: ProductSellBalanceSopmaterialdimensionrelationComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopmaterialdimensionrelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopmaterialdimensionrelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopmaterialdimensionrelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
