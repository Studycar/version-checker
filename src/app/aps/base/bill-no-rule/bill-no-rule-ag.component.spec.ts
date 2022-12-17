import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillNoRuleAgComponent } from './bill-no-rule-ag.component';

describe('BillNoRuleAgComponent', () => {
  let component: BillNoRuleAgComponent;
  let fixture: ComponentFixture<BillNoRuleAgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillNoRuleAgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillNoRuleAgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
