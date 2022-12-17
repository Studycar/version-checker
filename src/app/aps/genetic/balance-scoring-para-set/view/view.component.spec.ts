import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneticBalanceScoringParaSetViewComponent } from './view.component';

describe('GeneticBalanceScoringParaSetViewComponent', () => {
  let component: GeneticBalanceScoringParaSetViewComponent;
  let fixture: ComponentFixture<GeneticBalanceScoringParaSetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneticBalanceScoringParaSetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneticBalanceScoringParaSetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
