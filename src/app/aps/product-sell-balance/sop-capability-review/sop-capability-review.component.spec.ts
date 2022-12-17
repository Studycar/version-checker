import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SopCapabilityReviewComponent } from './sop-capability-review.component';

describe('SopCapabilityReviewComponent', () => {
  let component: SopCapabilityReviewComponent;
  let fixture: ComponentFixture<SopCapabilityReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SopCapabilityReviewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopCapabilityReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
