import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockageAnalysisComponent } from './stockage-analysis.component';

describe('StockageAnalysisComponent', () => {
  let component: StockageAnalysisComponent;
  let fixture: ComponentFixture<StockageAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockageAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockageAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
