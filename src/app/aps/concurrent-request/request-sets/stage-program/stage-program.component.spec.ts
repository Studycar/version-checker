import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageProgramComponent } from './stage-program.component';

describe('StageProgramComponent', () => {
  let component: StageProgramComponent;
  let fixture: ComponentFixture<StageProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StageProgramComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
