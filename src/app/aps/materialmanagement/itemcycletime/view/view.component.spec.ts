import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementItemcycletimeViewComponent } from './view.component';

describe('MaterialmanagementItemcycletimeViewComponent', () => {
  let component: MaterialmanagementItemcycletimeViewComponent;
  let fixture: ComponentFixture<MaterialmanagementItemcycletimeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementItemcycletimeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementItemcycletimeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
