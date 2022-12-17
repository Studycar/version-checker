import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SopCapabilityReviewDemandComponent } from './sop-capability-review-demand.component';

describe('SopCapabilityReviewDemandComponent', () => {
  let component: SopCapabilityReviewDemandComponent;
  let fixture: ComponentFixture<SopCapabilityReviewDemandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopCapabilityReviewDemandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopCapabilityReviewDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
