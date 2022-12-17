import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderVisualization } from './demand-order-visualization-view.component';

describe('DemandOrderVisualization', () => {
  let component: DemandOrderVisualization;
  let fixture: ComponentFixture<DemandOrderVisualization>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderVisualization ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderVisualization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
