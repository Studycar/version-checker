import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PcRequisitionManagementLineEditComponent } from './line_edit.component';

describe('PreparationPlatformPcbuyerEditComponent', () => {
  let component: PcRequisitionManagementLineEditComponent;
  let fixture: ComponentFixture<PcRequisitionManagementLineEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcRequisitionManagementLineEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcRequisitionManagementLineEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
