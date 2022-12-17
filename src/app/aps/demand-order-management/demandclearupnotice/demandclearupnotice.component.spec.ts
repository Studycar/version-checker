import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementDemandclearupnoticeComponent } from './demandclearupnotice.component';

describe('DemandOrderManagementDemandclearupnoticeComponent', () => {
  let component: DemandOrderManagementDemandclearupnoticeComponent;
  let fixture: ComponentFixture<DemandOrderManagementDemandclearupnoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementDemandclearupnoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementDemandclearupnoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
