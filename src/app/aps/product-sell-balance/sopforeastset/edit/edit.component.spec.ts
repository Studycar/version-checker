import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopforeastsetEditComponent } from './edit.component';

describe('ProductSellBalanceSopforeastsetEditComponent', () => {
  let component: ProductSellBalanceSopforeastsetEditComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopforeastsetEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopforeastsetEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopforeastsetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
