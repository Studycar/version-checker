import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestConcurrentDefineComponent } from './concurrent-define.component';

describe('ConcurrentRequestConcurrentDefineComponent', () => {
  let component: ConcurrentRequestConcurrentDefineComponent;
  let fixture: ComponentFixture<ConcurrentRequestConcurrentDefineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestConcurrentDefineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestConcurrentDefineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
