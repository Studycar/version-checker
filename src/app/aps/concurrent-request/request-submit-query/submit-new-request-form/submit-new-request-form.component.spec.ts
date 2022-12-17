import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcurrentRequestSubmitNewRequestFormComponent } from './submit-new-request-form.component';

describe('SubmitNewRequestFormComponent', () => {
  let component: ConcurrentRequestSubmitNewRequestFormComponent;
  let fixture: ComponentFixture<ConcurrentRequestSubmitNewRequestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestSubmitNewRequestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestSubmitNewRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
