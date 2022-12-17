import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadCapacityRuleEditComponent } from './edit.component';

describe('LoadCapacityRuleEditComponent', () => {
  let component: LoadCapacityRuleEditComponent;
  let fixture: ComponentFixture<LoadCapacityRuleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadCapacityRuleEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadCapacityRuleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
