import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopdemandanalysisdmComponent } from './sopdemandanalysisdm.component';

describe('ProductSellBalanceSopdemandanalysisdmComponent', () => {
  let component: ProductSellBalanceSopdemandanalysisdmComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopdemandanalysisdmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopdemandanalysisdmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopdemandanalysisdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
