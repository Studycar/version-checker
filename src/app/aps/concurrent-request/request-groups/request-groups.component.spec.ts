import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestRequestGroupsComponent } from './request-groups.component';

describe('ConcurrentRequestRequestGroupsComponent', () => {
  let component: ConcurrentRequestRequestGroupsComponent;
  let fixture: ComponentFixture<ConcurrentRequestRequestGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConcurrentRequestRequestGroupsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestRequestGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
