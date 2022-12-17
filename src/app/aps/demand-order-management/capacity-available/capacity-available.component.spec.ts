import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityAvailableComponent } from './capacity-available.component';

describe('CapacityAvailableComponent', () => {
  let component: CapacityAvailableComponent;
  let fixture: ComponentFixture<CapacityAvailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacityAvailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacityAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
