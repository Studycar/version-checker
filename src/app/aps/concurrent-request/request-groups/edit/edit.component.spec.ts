import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestRequestGroupsEditComponent } from './edit.component';

describe('ConcurrentRequestRequestGroupsEditComponent', () => {
  let component: ConcurrentRequestRequestGroupsEditComponent;
  let fixture: ComponentFixture<ConcurrentRequestRequestGroupsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConcurrentRequestRequestGroupsEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestRequestGroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
