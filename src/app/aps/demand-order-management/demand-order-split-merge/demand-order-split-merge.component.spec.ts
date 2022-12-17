import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementDemandOrderSplitMergeComponent } from './demand-order-split-merge.component';

describe('DemandOrderManagementDemandOrderSplitMergeComponent', () => {
  let component: DemandOrderManagementDemandOrderSplitMergeComponent;
  let fixture: ComponentFixture<DemandOrderManagementDemandOrderSplitMergeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementDemandOrderSplitMergeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementDemandOrderSplitMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
