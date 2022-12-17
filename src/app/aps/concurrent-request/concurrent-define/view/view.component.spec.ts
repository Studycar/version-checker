import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestConcurrentDefineViewComponent } from './view.component';

describe('ConcurrentRequestConcurrentDefineViewComponent', () => {
  let component: ConcurrentRequestConcurrentDefineViewComponent;
  let fixture: ComponentFixture<ConcurrentRequestConcurrentDefineViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestConcurrentDefineViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestConcurrentDefineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
