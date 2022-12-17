import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementItemCategoryAssignComponent } from './item-category-assign.component';

describe('MaterialmanagementItemCategoryAssignComponent', () => {
  let component: MaterialmanagementItemCategoryAssignComponent;
  let fixture: ComponentFixture<MaterialmanagementItemCategoryAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementItemCategoryAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementItemCategoryAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
