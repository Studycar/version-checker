import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementDemandclearupnoticesplitComponent } from './demandclearupnoticesplit.component';

describe('DemandOrderManagementDemandclearupnoticesplitComponent', () => {
  let component: DemandOrderManagementDemandclearupnoticesplitComponent;
  let fixture: ComponentFixture<DemandOrderManagementDemandclearupnoticesplitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementDemandclearupnoticesplitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementDemandclearupnoticesplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
