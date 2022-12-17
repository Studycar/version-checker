import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanschedulePsassemblyrelationComponent } from './psassemblyrelation.component';

describe('PlanschedulePsassemblyrelationComponent', () => {
  let component: PlanschedulePsassemblyrelationComponent;
  let fixture: ComponentFixture<PlanschedulePsassemblyrelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanschedulePsassemblyrelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanschedulePsassemblyrelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
