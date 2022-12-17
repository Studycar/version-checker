import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseMessageRuleEditComponent } from './rule-edit.component';

describe('BaseMessageRuleEditComponent', () => {
  let component: BaseMessageRuleEditComponent;
  let fixture: ComponentFixture<BaseMessageRuleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseMessageRuleEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMessageRuleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
