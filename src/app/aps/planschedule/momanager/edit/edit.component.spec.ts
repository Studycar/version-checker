import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanscheduleMomanagerEditComponent } from './edit.component';

describe('PlanscheduleMomanagerEditComponent', () => {
  let component: PlanscheduleMomanagerEditComponent;
  let fixture: ComponentFixture<PlanscheduleMomanagerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanscheduleMomanagerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanscheduleMomanagerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
