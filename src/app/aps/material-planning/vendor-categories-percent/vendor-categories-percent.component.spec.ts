import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCategoriesPercentComponent } from './vendor-categories-percent.component';

describe('VendorCategoriesPercentComponent', () => {
  let component: VendorCategoriesPercentComponent;
  let fixture: ComponentFixture<VendorCategoriesPercentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorCategoriesPercentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCategoriesPercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
