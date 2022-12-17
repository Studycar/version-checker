import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopmaterialdimensionrelationEditComponent } from './edit.component';

describe('ProductSellBalanceSopmaterialdimensionrelationEditComponent', () => {
  let component: ProductSellBalanceSopmaterialdimensionrelationEditComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopmaterialdimensionrelationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopmaterialdimensionrelationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopmaterialdimensionrelationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
