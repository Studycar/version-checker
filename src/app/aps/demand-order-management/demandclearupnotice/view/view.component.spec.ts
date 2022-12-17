import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementDemandclearupnoticeViewComponent } from './view.component';

describe('DemandOrderManagementDemandclearupnoticeViewComponent', () => {
  let component: DemandOrderManagementDemandclearupnoticeViewComponent;
  let fixture: ComponentFixture<DemandOrderManagementDemandclearupnoticeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementDemandclearupnoticeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementDemandclearupnoticeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
