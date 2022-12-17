import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestServernodesManagerComponent } from './servernodes-manager.component';

describe('ConcurrentRequestServernodesManagerComponent', () => {
  let component: ConcurrentRequestServernodesManagerComponent;
  let fixture: ComponentFixture<ConcurrentRequestServernodesManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestServernodesManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestServernodesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
