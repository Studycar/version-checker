import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharePlanShareMergeRuleComponent } from './share-merge-rule.component';

describe('SharePlanShareMergeRuleComponent', () => {
  let component: SharePlanShareMergeRuleComponent;
  let fixture: ComponentFixture<SharePlanShareMergeRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePlanShareMergeRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePlanShareMergeRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
