import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestRequestSetsComponent } from './request-sets.component';

describe('ConcurrentRequestRequestSetsComponent', () => {
  let component: ConcurrentRequestRequestSetsComponent;
  let fixture: ComponentFixture<ConcurrentRequestRequestSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConcurrentRequestRequestSetsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestRequestSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
