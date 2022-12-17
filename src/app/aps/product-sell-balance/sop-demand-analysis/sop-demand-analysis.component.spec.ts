import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SopDemandAnalysisComponent } from './sop-demand-analysis.component';

describe('SopDemandAnalysisComponent', () => {
  let component: SopDemandAnalysisComponent;
  let fixture: ComponentFixture<SopDemandAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopDemandAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopDemandAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
