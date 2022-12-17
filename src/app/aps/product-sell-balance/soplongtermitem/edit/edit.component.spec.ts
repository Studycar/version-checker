import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementCategorymanageEditComponent } from './edit.component';

describe('MaterialmanagementCategorymanageEditComponent', () => {
  let component: MaterialmanagementCategorymanageEditComponent;
  let fixture: ComponentFixture<MaterialmanagementCategorymanageEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementCategorymanageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementCategorymanageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
