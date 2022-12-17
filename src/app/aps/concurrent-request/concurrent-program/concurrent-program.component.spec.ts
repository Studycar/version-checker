import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestConcurrentProgramComponent } from './concurrent-program.component';

describe('ConcurrentRequestConcurrentProgramComponent', () => {
  let component: ConcurrentRequestConcurrentProgramComponent;
  let fixture: ComponentFixture<ConcurrentRequestConcurrentProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestConcurrentProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestConcurrentProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
