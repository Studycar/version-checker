import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcurrentRequestRequestSetsFormComponent } from './request-sets-form.component';

describe('RequestSetsFormComponent', () => {
  let component: ConcurrentRequestRequestSetsFormComponent;
  let fixture: ComponentFixture<ConcurrentRequestRequestSetsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestRequestSetsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestRequestSetsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
