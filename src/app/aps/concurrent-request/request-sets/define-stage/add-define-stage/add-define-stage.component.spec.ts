import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDefineStageComponent } from './add-define-stage.component';

describe('AddDefineStageComponent', () => {
  let component: AddDefineStageComponent;
  let fixture: ComponentFixture<AddDefineStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDefineStageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDefineStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
