import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharePlanShareIssuedWorkbenchComponent } from './share-issued-workbench.component';

describe('SharePlanShareIssuedWorkbenchComponent', () => {
  let component: SharePlanShareIssuedWorkbenchComponent;
  let fixture: ComponentFixture<SharePlanShareIssuedWorkbenchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePlanShareIssuedWorkbenchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePlanShareIssuedWorkbenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
