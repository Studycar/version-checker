import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSellBalanceSopdemandanalysisdmEditComponent } from './edit.component';

describe('ProductSellBalanceSopdemandanalysisdmEditComponent', () => {
  let component: ProductSellBalanceSopdemandanalysisdmEditComponent;
  let fixture: ComponentFixture<ProductSellBalanceSopdemandanalysisdmEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellBalanceSopdemandanalysisdmEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellBalanceSopdemandanalysisdmEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
