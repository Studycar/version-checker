import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestRequestSetsViewComponent } from './view.component';

describe('ConcurrentRequestRequestSetsViewComponent', () => {
  let component: ConcurrentRequestRequestSetsViewComponent;
  let fixture: ComponentFixture<ConcurrentRequestRequestSetsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestRequestSetsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestRequestSetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
