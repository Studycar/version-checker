import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockageAnalysisDetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: StockageAnalysisDetailComponent;
  let fixture: ComponentFixture<StockageAnalysisDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockageAnalysisDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockageAnalysisDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
