import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SopReductionRuleManageComponent } from './sop-reductionRuleManage.component';

describe('SopReductionRuleManageComponent', () => {
  let component: SopReductionRuleManageComponent ;
  let fixture: ComponentFixture<SopReductionRuleManageComponent >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopReductionRuleManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopReductionRuleManageComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
