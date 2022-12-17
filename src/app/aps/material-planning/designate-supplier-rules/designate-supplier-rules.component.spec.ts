import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignateSupplierRulesComponent } from './designate-supplier-rules.component';

describe('DesignateSupplierRulesComponent', () => {
  let component: DesignateSupplierRulesComponent;
  let fixture: ComponentFixture<DesignateSupplierRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignateSupplierRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignateSupplierRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
