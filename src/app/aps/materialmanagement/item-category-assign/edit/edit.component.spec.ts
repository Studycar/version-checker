import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementItemCategoryAssignEditComponent } from './edit.component';

describe('MaterialmanagementItemCategoryAssignEditComponent', () => {
  let component: MaterialmanagementItemCategoryAssignEditComponent;
  let fixture: ComponentFixture<MaterialmanagementItemCategoryAssignEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementItemCategoryAssignEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementItemCategoryAssignEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
