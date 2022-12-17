import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestConcurrentRuleComponent } from './concurrent-rule.component';

describe('ConcurrentRequestConcurrentRuleComponent', () => {
  let component: ConcurrentRequestConcurrentRuleComponent;
  let fixture: ComponentFixture<ConcurrentRequestConcurrentRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestConcurrentRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestConcurrentRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
