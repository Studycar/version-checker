import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentRequestServernodesManagerEditComponent } from './edit.component';

describe('ConcurrentRequestServernodesManagerEditComponent', () => {
  let component: ConcurrentRequestServernodesManagerEditComponent;
  let fixture: ComponentFixture<ConcurrentRequestServernodesManagerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestServernodesManagerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestServernodesManagerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
