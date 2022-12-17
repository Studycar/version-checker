import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanscheduleDigitalizationWorkbenchComponent } from './digitalization-workbench.component';

describe('PlanscheduleDigitalizationWorkbenchComponent', () => {
  let component: PlanscheduleDigitalizationWorkbenchComponent;
  let fixture: ComponentFixture<PlanscheduleDigitalizationWorkbenchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanscheduleDigitalizationWorkbenchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanscheduleDigitalizationWorkbenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
