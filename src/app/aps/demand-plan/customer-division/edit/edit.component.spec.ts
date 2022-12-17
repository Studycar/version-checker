import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandPlanCustomerDivisionEditComponent } from './edit.component';

describe('DemandPlanCustomerDivisionEditComponent', () => {
  let component: DemandPlanCustomerDivisionEditComponent;
  let fixture: ComponentFixture<DemandPlanCustomerDivisionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandPlanCustomerDivisionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandPlanCustomerDivisionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
