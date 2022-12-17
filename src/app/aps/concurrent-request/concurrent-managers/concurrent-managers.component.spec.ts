import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestConcurrentManagersComponent } from './concurrent-managers.component';

describe('ConcurrentRequestConcurrentManagersComponent', () => {
  let component: ConcurrentRequestConcurrentManagersComponent;
  let fixture: ComponentFixture<ConcurrentRequestConcurrentManagersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestConcurrentManagersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestConcurrentManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
