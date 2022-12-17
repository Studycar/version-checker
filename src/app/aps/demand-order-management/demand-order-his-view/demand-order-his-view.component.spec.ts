import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandOrderHisViewComponent } from './demand-order-his-view.component';

describe('HisViewComponent', () => {
  let component: DemandOrderHisViewComponent;
  let fixture: ComponentFixture<DemandOrderHisViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderHisViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderHisViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
