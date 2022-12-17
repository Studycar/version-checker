import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementCategorySetManagerComponent } from './category-set-manager.component';

describe('MaterialmanagementCategorySetManagerComponent', () => {
  let component: MaterialmanagementCategorySetManagerComponent;
  let fixture: ComponentFixture<MaterialmanagementCategorySetManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementCategorySetManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementCategorySetManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
