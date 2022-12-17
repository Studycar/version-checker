import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestConcurrentProgramEditComponent } from './edit.component';

describe('ConcurrentRequestConcurrentProgramEditComponent', () => {
  let component: ConcurrentRequestConcurrentProgramEditComponent;
  let fixture: ComponentFixture<ConcurrentRequestConcurrentProgramEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestConcurrentProgramEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestConcurrentProgramEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
