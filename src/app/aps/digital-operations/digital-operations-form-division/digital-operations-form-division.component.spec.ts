import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalOperationsFormDivisionComponent } from './digital-operations-form-division.component';

describe('DigitalOperationsFormDivisionComponent', () => {
  let component: DigitalOperationsFormDivisionComponent;
  let fixture: ComponentFixture<DigitalOperationsFormDivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DigitalOperationsFormDivisionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalOperationsFormDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
