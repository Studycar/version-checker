import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeoverTimeComponent } from './changeover-time.component';

describe('ChangeoverTimeComponent', () => {
  let component: ChangeoverTimeComponent;
  let fixture: ComponentFixture<ChangeoverTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeoverTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeoverTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
