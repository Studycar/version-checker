import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStageProgArgsComponent } from './add-stage-prog-args.component';

describe('AddStageProgArgsComponent', () => {
  let component: AddStageProgArgsComponent;
  let fixture: ComponentFixture<AddStageProgArgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddStageProgArgsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStageProgArgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
