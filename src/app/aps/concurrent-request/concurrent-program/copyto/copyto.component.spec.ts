import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestConcurrentProgramCopytoComponent } from './copyto.component';

describe('ConcurrentRequestConcurrentProgramCopytoComponent', () => {
  let component: ConcurrentRequestConcurrentProgramCopytoComponent;
  let fixture: ComponentFixture<ConcurrentRequestConcurrentProgramCopytoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestConcurrentProgramCopytoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestConcurrentProgramCopytoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
