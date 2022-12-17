import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementReqlinetypedefaultsetEditComponent } from './edit.component';

describe('DemandOrderManagementReqlinetypedefaultsetEditComponent', () => {
  let component: DemandOrderManagementReqlinetypedefaultsetEditComponent;
  let fixture: ComponentFixture<DemandOrderManagementReqlinetypedefaultsetEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementReqlinetypedefaultsetEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementReqlinetypedefaultsetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
