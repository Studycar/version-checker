import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneticBalanceScoringParaSetComponent } from './balance-scoring-para-set.component';

describe('GeneticBalanceScoringParaSetComponent', () => {
  let component: GeneticBalanceScoringParaSetComponent;
  let fixture: ComponentFixture<GeneticBalanceScoringParaSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneticBalanceScoringParaSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneticBalanceScoringParaSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
