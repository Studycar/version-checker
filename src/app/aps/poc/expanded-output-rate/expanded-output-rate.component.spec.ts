import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedOutputRateComponent } from './expanded-output-rate.component';

describe('ExpandedOutputRateComponent', () => {
  let component: ExpandedOutputRateComponent;
  let fixture: ComponentFixture<ExpandedOutputRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandedOutputRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandedOutputRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
