import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalOperationsUserPrivilageComponent } from './digital-operations-user-privilage.component';

describe('DigitalOperationsUserPrivilageComponent', () => {
  let component: DigitalOperationsUserPrivilageComponent;
  let fixture: ComponentFixture<DigitalOperationsUserPrivilageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DigitalOperationsUserPrivilageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalOperationsUserPrivilageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
