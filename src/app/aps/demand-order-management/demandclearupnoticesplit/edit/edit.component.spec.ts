import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementDemandclearupnoticesplitEditComponent } from './edit.component';

describe('DemandOrderManagementDemandclearupnoticesplitEditComponent', () => {
  let component: DemandOrderManagementDemandclearupnoticesplitEditComponent;
  let fixture: ComponentFixture<DemandOrderManagementDemandclearupnoticesplitEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementDemandclearupnoticesplitEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementDemandclearupnoticesplitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
