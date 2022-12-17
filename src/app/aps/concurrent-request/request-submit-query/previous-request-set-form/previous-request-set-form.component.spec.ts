import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcurrentRequestPreviousRequestSetFormComponent } from './previous-request-set-form.component';

describe('ConcurrentRequestPreviousRequestSetFormComponent', () => {
  let component: ConcurrentRequestPreviousRequestSetFormComponent;
  let fixture: ComponentFixture<ConcurrentRequestPreviousRequestSetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestPreviousRequestSetFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestPreviousRequestSetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
