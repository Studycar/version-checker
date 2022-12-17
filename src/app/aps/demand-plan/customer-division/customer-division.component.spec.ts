import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandPlanCustomerDivisionComponent } from './customer-division.component';

describe('DemandPlanCustomerDivisionComponent', () => {
  let component: DemandPlanCustomerDivisionComponent;
  let fixture: ComponentFixture<DemandPlanCustomerDivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandPlanCustomerDivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandPlanCustomerDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
