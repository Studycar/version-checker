import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFlexValueSetsDetail2Component } from './detail2.component';

describe('BaseFlexValueSetsDetail2Component', () => {
  let component: BaseFlexValueSetsDetail2Component;
  let fixture: ComponentFixture<BaseFlexValueSetsDetail2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseFlexValueSetsDetail2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFlexValueSetsDetail2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
