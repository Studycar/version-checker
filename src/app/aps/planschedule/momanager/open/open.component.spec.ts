import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanscheduleMomanagerOpenComponent } from './open.component';

describe('PlanscheduleMomanagerOpenComponent', () => {
  let component: PlanscheduleMomanagerOpenComponent;
  let fixture: ComponentFixture<PlanscheduleMomanagerOpenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanscheduleMomanagerOpenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanscheduleMomanagerOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
