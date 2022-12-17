import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementItemcycletimeEditComponent } from './edit.component';

describe('MaterialmanagementItemcycletimeEditComponent', () => {
  let component: MaterialmanagementItemcycletimeEditComponent;
  let fixture: ComponentFixture<MaterialmanagementItemcycletimeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementItemcycletimeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementItemcycletimeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
