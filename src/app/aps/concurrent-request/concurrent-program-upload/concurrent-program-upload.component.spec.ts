import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestConcurrentProgramUploadComponent } from './concurrent-program-upload.component';

describe('ConcurrentRequestConcurrentProgramUploadComponent', () => {
  let component: ConcurrentRequestConcurrentProgramUploadComponent;
  let fixture: ComponentFixture<ConcurrentRequestConcurrentProgramUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestConcurrentProgramUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestConcurrentProgramUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
