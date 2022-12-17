import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanscheduleMoComVindicateComponent } from './mo-comvindicate.component';

describe('PlanscheduleMoComVindicateComponent', () => {
  let component: PlanscheduleMoComVindicateComponent;
  let fixture: ComponentFixture<PlanscheduleMoComVindicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanscheduleMoComVindicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanscheduleMoComVindicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
