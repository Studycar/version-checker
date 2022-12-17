import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopdimmainresreviewComponent } from './sopdimmainresreview.component';

describe('ProductSellBalanceSopdimmainresreviewComponent', () => {
  let component: ProductSellBalanceSopdimmainresreviewComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopdimmainresreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopdimmainresreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopdimmainresreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
