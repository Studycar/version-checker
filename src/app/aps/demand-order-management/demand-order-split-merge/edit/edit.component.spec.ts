import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementDemandOrderSplitMergeEditComponent } from './edit.component';

describe('DemandOrderManagementDemandOrderSplitMergeEditComponent', () => {
  let component: DemandOrderManagementDemandOrderSplitMergeEditComponent;
  let fixture: ComponentFixture<DemandOrderManagementDemandOrderSplitMergeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementDemandOrderSplitMergeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementDemandOrderSplitMergeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
