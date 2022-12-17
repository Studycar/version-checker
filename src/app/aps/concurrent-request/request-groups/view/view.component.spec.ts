import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestRequestGroupsViewComponent } from './view.component';

describe('ConcurrentRequestRequestGroupsViewComponent', () => {
  let component: ConcurrentRequestRequestGroupsViewComponent;
  let fixture: ComponentFixture<ConcurrentRequestRequestGroupsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConcurrentRequestRequestGroupsViewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestRequestGroupsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
