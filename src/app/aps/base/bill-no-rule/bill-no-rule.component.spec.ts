import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillNoRuleComponent } from './bill-no-rule.component';

describe('BillNoRuleComponent', () => {
  let component: BillNoRuleComponent;
  let fixture: ComponentFixture<BillNoRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillNoRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillNoRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
