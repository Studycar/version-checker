import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementCategorySetManagerEditComponent } from './edit.component';

describe('MaterialmanagementCategorySetManagerEditComponent', () => {
  let component: MaterialmanagementCategorySetManagerEditComponent;
  let fixture: ComponentFixture<MaterialmanagementCategorySetManagerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementCategorySetManagerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementCategorySetManagerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
