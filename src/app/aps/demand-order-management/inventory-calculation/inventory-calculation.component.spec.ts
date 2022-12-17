import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCalculationComponent } from './inventory-calculation.component';

describe('InventoryCalculationComponent', () => {
  let component: InventoryCalculationComponent;
  let fixture: ComponentFixture<InventoryCalculationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryCalculationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
