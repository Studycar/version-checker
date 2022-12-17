import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopdimmainresreviewEditComponent } from './edit.component';

describe('ProductSellBalanceSopdimmainresreviewEditComponent', () => {
  let component: ProductSellBalanceSopdimmainresreviewEditComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopdimmainresreviewEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopdimmainresreviewEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopdimmainresreviewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
