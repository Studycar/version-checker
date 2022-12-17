import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneticPlanProductionEditComponent } from './edit.component';

describe('GeneticPlanProductionEditComponent', () => {
  let component: GeneticPlanProductionEditComponent;
  let fixture: ComponentFixture<GeneticPlanProductionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneticPlanProductionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneticPlanProductionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
