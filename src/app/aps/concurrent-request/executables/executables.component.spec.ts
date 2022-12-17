import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestExecutablesComponent } from './executables.component';

describe('ConcurrentRequestExecutablesComponent', () => {
  let component: ConcurrentRequestExecutablesComponent;
  let fixture: ComponentFixture<ConcurrentRequestExecutablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestExecutablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestExecutablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
