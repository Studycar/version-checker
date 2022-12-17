import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestExecutablesEditComponent } from './edit.component';

describe('ConcurrentRequestExecutablesEditComponent', () => {
  let component: ConcurrentRequestExecutablesEditComponent;
  let fixture: ComponentFixture<ConcurrentRequestExecutablesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestExecutablesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestExecutablesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
