import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementMaterialProcessGridComponent } from './material-process-grid.component';

describe('MaterialmanagementMaterialProcessGridComponent', () => {
  let component: MaterialmanagementMaterialProcessGridComponent;
  let fixture: ComponentFixture<MaterialmanagementMaterialProcessGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementMaterialProcessGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementMaterialProcessGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
