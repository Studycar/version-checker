import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestConcurrentProgramSerialComponent } from './concurrent-program-serial.component';

describe('ConcurrentRequestConcurrentProgramSerialComponent', () => {
  let component: ConcurrentRequestConcurrentProgramSerialComponent;
  let fixture: ComponentFixture<ConcurrentRequestConcurrentProgramSerialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestConcurrentProgramSerialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestConcurrentProgramSerialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
