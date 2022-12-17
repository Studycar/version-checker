import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseFlexValueSetsComponent } from './base-flex-value-sets.component';

describe('BaseFlexValueSetsComponent', () => {
  let component: BaseFlexValueSetsComponent;
  let fixture: ComponentFixture<BaseFlexValueSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseFlexValueSetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFlexValueSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
