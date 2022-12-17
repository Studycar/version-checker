import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductReleaseByTimeComponent } from './product-release-by-time.component';

describe('ProductReleaseByTimeComponent', () => {
  let component: ProductReleaseByTimeComponent;
  let fixture: ComponentFixture<ProductReleaseByTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductReleaseByTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReleaseByTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
