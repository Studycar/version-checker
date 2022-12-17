import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharePlanShareMergeRuleEditComponent } from './edit.component';

describe('SharePlanShareMergeRuleEditComponent', () => {
  let component: SharePlanShareMergeRuleEditComponent;
  let fixture: ComponentFixture<SharePlanShareMergeRuleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePlanShareMergeRuleEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePlanShareMergeRuleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
