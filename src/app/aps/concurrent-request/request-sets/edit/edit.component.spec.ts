import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestRequestSetsEditComponent } from './edit.component';

describe('ConcurrentRequestRequestSetsEditComponent', () => {
  let component: ConcurrentRequestRequestSetsEditComponent;
  let fixture: ComponentFixture<ConcurrentRequestRequestSetsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConcurrentRequestRequestSetsEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestRequestSetsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
