import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopdemandimportComponent } from './sopdemandimport.component';

describe('ProductSellBalanceSopdemandimportComponent', () => {
  let component: ProductSellBalanceSopdemandimportComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopdemandimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopdemandimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopdemandimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
