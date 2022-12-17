import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementItemcycletimeComponent } from './itemcycletime.component';

describe('MaterialmanagementItemcycletimeComponent', () => {
  let component: MaterialmanagementItemcycletimeComponent;
  let fixture: ComponentFixture<MaterialmanagementItemcycletimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementItemcycletimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementItemcycletimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
