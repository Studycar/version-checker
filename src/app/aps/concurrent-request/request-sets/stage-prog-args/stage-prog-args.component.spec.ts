import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageProgArgsComponent } from './stage-prog-args.component';

describe('StageProgArgsComponent', () => {
  let component: StageProgArgsComponent;
  let fixture: ComponentFixture<StageProgArgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StageProgArgsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageProgArgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
