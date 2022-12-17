import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCommitmentComponent } from './order-commitment.component';

describe('OrderCommitmentComponent', () => {
  let component: OrderCommitmentComponent;
  let fixture: ComponentFixture<OrderCommitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCommitmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCommitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
