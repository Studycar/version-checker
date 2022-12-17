import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxModalComponent } from './checkbox-modal.component';

describe('CheckboxModalComponent', () => {
  let component: CheckboxModalComponent;
  let fixture: ComponentFixture<CheckboxModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
