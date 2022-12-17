import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneticPlanProductionViewComponent } from './view.component';

describe('GeneticPlanProductionViewComponent', () => {
  let component: GeneticPlanProductionViewComponent;
  let fixture: ComponentFixture<GeneticPlanProductionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneticPlanProductionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneticPlanProductionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
