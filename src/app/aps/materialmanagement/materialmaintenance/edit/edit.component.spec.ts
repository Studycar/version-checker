import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementMaterialmaintenanceEditComponent } from './edit.component';

describe('MaterialmanagementMaterialmaintenanceEditComponent', () => {
  let component: MaterialmanagementMaterialmaintenanceEditComponent;
  let fixture: ComponentFixture<MaterialmanagementMaterialmaintenanceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementMaterialmaintenanceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementMaterialmaintenanceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
