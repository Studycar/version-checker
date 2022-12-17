import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopforeastsetComponent } from './sopforeastset.component';

describe('ProductSellBalanceSopforeastsetComponent', () => {
  let component: ProductSellBalanceSopforeastsetComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopforeastsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopforeastsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopforeastsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
