import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdlineItemsOptimizationComponent } from './prodline-items-optimization.component';

describe('ProdlineItemsOptimizationComponent', () => {
  let component: ProdlineItemsOptimizationComponent;
  let fixture: ComponentFixture<ProdlineItemsOptimizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdlineItemsOptimizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdlineItemsOptimizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
