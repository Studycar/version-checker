import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanscheduleMomanagerComponent } from './momanager.component';

describe('PlanscheduleMomanagerComponent', () => {
  let component: PlanscheduleMomanagerComponent;
  let fixture: ComponentFixture<PlanscheduleMomanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanscheduleMomanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanscheduleMomanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
