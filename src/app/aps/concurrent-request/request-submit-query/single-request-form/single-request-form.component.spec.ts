import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcurrentRequestSingleRequestFormComponent } from './single-request-form.component';

describe('SingleRequestFormComponent', () => {
  let component: ConcurrentRequestSingleRequestFormComponent;
  let fixture: ComponentFixture<ConcurrentRequestSingleRequestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestSingleRequestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestSingleRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
