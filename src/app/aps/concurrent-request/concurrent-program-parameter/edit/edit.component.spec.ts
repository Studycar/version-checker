import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestConcurrentProgramParameterEditComponent } from './edit.component';

describe('ConcurrentRequestConcurrentProgramParameterEditComponent', () => {
  let component: ConcurrentRequestConcurrentProgramParameterEditComponent;
  let fixture: ComponentFixture<ConcurrentRequestConcurrentProgramParameterEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestConcurrentProgramParameterEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestConcurrentProgramParameterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
