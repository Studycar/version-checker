import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStageProgramComponent } from './add-stage-program.component';

describe('AddStageProgramComponent', () => {
  let component: AddStageProgramComponent;
  let fixture: ComponentFixture<AddStageProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddStageProgramComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStageProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
