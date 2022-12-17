import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementMaterialmaintenanceComponent } from './materialmaintenance.component';

describe('MaterialmanagementMaterialmaintenanceComponent', () => {
  let component: MaterialmanagementMaterialmaintenanceComponent;
  let fixture: ComponentFixture<MaterialmanagementMaterialmaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementMaterialmaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementMaterialmaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
