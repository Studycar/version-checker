import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcurrentRequestPreviousRequestFormComponent } from './previous-request-form.component';

describe('PreviousRequestFormComponent', () => {
  let component: ConcurrentRequestPreviousRequestFormComponent;
  let fixture: ComponentFixture<ConcurrentRequestPreviousRequestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestPreviousRequestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestPreviousRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
