import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestConcurrentProgramParameterComponent } from './concurrent-program-parameter.component';

describe('ConcurrentRequestConcurrentProgramParameterComponent', () => {
  let component: ConcurrentRequestConcurrentProgramParameterComponent;
  let fixture: ComponentFixture<ConcurrentRequestConcurrentProgramParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestConcurrentProgramParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestConcurrentProgramParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
