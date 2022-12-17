import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PcRequisitionManagementEditComponent } from './edit.component';

describe('PreparationPlatformPcbuyerEditComponent', () => {
  let component: PcRequisitionManagementEditComponent;
  let fixture: ComponentFixture<PcRequisitionManagementEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcRequisitionManagementEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcRequisitionManagementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
