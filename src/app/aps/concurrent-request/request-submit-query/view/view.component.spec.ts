import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestRequestSubmitQueryViewComponent } from './view.component';

describe('ConcurrentRequestRequestSubmitQueryViewComponent', () => {
  let component: ConcurrentRequestRequestSubmitQueryViewComponent;
  let fixture: ComponentFixture<ConcurrentRequestRequestSubmitQueryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestRequestSubmitQueryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestRequestSubmitQueryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
