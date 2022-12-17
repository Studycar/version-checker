import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadCapacityComponent } from './load-capacity.component';

describe('LoadCapacityComponent', () => {
  let component: LoadCapacityComponent;
  let fixture: ComponentFixture<LoadCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
