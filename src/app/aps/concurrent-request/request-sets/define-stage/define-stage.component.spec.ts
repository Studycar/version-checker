import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineStageComponent } from './define-stage.component';

describe('DefineStageComponent', () => {
  let component: DefineStageComponent;
  let fixture: ComponentFixture<DefineStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefineStageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
