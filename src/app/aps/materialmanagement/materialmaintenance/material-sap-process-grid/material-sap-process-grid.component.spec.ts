import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementSapProcessGridComponent } from './material-sap-process-grid.component';

describe('MaterialmanagementMaterialProcessGridComponent', () => {
  let component: MaterialmanagementSapProcessGridComponent;
  let fixture: ComponentFixture<MaterialmanagementSapProcessGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementSapProcessGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementSapProcessGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
