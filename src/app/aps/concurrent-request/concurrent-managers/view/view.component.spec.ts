import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestConcurrentManagersViewComponent } from './view.component';

describe('ConcurrentRequestConcurrentManagersViewComponent', () => {
  let component: ConcurrentRequestConcurrentManagersViewComponent;
  let fixture: ComponentFixture<ConcurrentRequestConcurrentManagersViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestConcurrentManagersViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestConcurrentManagersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
