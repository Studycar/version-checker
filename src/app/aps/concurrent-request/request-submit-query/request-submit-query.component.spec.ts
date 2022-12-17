import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestRequestSubmitQueryComponent } from './request-submit-query.component';

describe('ConcurrentRequestRequestSubmitQueryComponent', () => {
  let component: ConcurrentRequestRequestSubmitQueryComponent;
  let fixture: ComponentFixture<ConcurrentRequestRequestSubmitQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestRequestSubmitQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestRequestSubmitQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
