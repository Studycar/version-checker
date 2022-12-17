import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestRequestGroupsDetailComponent } from './request-groups-detail.component';

describe('ConcurrentRequestRequestGroupsDetailComponent', () => {
  let component: ConcurrentRequestRequestGroupsDetailComponent;
  let fixture: ComponentFixture<ConcurrentRequestRequestGroupsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConcurrentRequestRequestGroupsDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestRequestGroupsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
