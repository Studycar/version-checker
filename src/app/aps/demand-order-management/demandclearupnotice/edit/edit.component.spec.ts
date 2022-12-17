import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementDemandclearupnoticeEditComponent } from './edit.component';

describe('DemandOrderManagementDemandclearupnoticeEditComponent', () => {
  let component: DemandOrderManagementDemandclearupnoticeEditComponent;
  let fixture: ComponentFixture<DemandOrderManagementDemandclearupnoticeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementDemandclearupnoticeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementDemandclearupnoticeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
