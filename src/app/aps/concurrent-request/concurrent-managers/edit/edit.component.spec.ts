import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestConcurrentManagersEditComponent } from './edit.component';

describe('ConcurrentRequestConcurrentManagersEditComponent', () => {
  let component: ConcurrentRequestConcurrentManagersEditComponent;
  let fixture: ComponentFixture<ConcurrentRequestConcurrentManagersEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestConcurrentManagersEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestConcurrentManagersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
