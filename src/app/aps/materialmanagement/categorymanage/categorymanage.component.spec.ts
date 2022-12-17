import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementCategorymanageComponent } from './categorymanage.component';

describe('MaterialmanagementCategorymanageComponent', () => {
  let component: MaterialmanagementCategorymanageComponent;
  let fixture: ComponentFixture<MaterialmanagementCategorymanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementCategorymanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementCategorymanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
