import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementReqlinetypedefaultsetComponent } from './reqlinetypedefaultset.component';

describe('DemandOrderManagementReqlinetypedefaultsetComponent', () => {
  let component: DemandOrderManagementReqlinetypedefaultsetComponent;
  let fixture: ComponentFixture<DemandOrderManagementReqlinetypedefaultsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementReqlinetypedefaultsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementReqlinetypedefaultsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
