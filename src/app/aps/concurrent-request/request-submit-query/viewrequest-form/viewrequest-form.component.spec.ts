import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcurrentRequestViewrequestFormComponent } from './viewrequest-form.component';

describe('ViewrequestFormComponent', () => {
  let component: ConcurrentRequestViewrequestFormComponent;
  let fixture: ComponentFixture<ConcurrentRequestViewrequestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestViewrequestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestViewrequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
