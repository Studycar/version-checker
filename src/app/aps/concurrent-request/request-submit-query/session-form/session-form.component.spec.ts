import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcurrentRequestSessionFormComponent } from './session-form.component';

describe('SessionFormComponent', () => {
  let component: ConcurrentRequestSessionFormComponent;
  let fixture: ComponentFixture<ConcurrentRequestSessionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestSessionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestSessionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
