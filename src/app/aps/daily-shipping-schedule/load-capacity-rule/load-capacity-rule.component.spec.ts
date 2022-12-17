import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadCapacityRuleComponent } from './load-capacity-rule.component';

describe('LoadCapacityRuleComponent', () => {
  let component: LoadCapacityRuleComponent;
  let fixture: ComponentFixture<LoadCapacityRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadCapacityRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadCapacityRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
