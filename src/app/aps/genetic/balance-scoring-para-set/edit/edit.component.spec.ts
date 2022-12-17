import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneticBalanceScoringParaSetEditComponent } from './edit.component';

describe('GeneticBalanceScoringParaSetEditComponent', () => {
  let component: GeneticBalanceScoringParaSetEditComponent;
  let fixture: ComponentFixture<GeneticBalanceScoringParaSetEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneticBalanceScoringParaSetEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneticBalanceScoringParaSetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
