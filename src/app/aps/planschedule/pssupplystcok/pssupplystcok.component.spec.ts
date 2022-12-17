import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanschedulePsSupplyStcokComponent } from './pssupplystcok.component';

describe('PlanschedulePsSupplyStcokComponent', () => {
  let component: PlanschedulePsSupplyStcokComponent;
  let fixture: ComponentFixture<PlanschedulePsSupplyStcokComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanschedulePsSupplyStcokComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanschedulePsSupplyStcokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
