import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestConcurrentDefineEditComponent } from './edit.component';

describe('ConcurrentRequestConcurrentDefineEditComponent', () => {
  let component: ConcurrentRequestConcurrentDefineEditComponent;
  let fixture: ComponentFixture<ConcurrentRequestConcurrentDefineEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConcurrentRequestConcurrentDefineEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestConcurrentDefineEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
