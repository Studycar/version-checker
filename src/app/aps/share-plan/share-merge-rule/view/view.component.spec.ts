import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharePlanShareMergeRuleViewComponent } from './view.component';

describe('SharePlanShareMergeRuleViewComponent', () => {
  let component: SharePlanShareMergeRuleViewComponent;
  let fixture: ComponentFixture<SharePlanShareMergeRuleViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePlanShareMergeRuleViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePlanShareMergeRuleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
