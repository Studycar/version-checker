import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanschedulePsassemblyrelationEditComponent } from './edit.component';

describe('PlanschedulePsassemblyrelationEditComponent', () => {
  let component: PlanschedulePsassemblyrelationEditComponent;
  let fixture: ComponentFixture<PlanschedulePsassemblyrelationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanschedulePsassemblyrelationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanschedulePsassemblyrelationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
