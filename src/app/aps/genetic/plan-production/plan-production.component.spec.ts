import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneticPlanProductionComponent } from './plan-production.component';

describe('GeneticPlanProductionComponent', () => {
  let component: GeneticPlanProductionComponent;
  let fixture: ComponentFixture<GeneticPlanProductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneticPlanProductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneticPlanProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
