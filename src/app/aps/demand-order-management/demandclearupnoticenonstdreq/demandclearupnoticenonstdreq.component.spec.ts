import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementDemandclearupnoticenonstdreqComponent } from './demandclearupnoticenonstdreq.component';

describe('DemandOrderManagementDemandclearupnoticenonstdreqComponent', () => {
  let component: DemandOrderManagementDemandclearupnoticenonstdreqComponent;
  let fixture: ComponentFixture<DemandOrderManagementDemandclearupnoticenonstdreqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementDemandclearupnoticenonstdreqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementDemandclearupnoticenonstdreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
