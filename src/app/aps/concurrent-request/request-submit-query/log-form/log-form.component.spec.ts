import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcurrentRequestLogFormComponent } from './log-form.component';

describe('ConcurrentRequestLogFormComponent', () => {
  let component: ConcurrentRequestLogFormComponent;
  let fixture: ComponentFixture<ConcurrentRequestLogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestLogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestLogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
