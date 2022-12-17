import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementMtsWorkbenchComponent } from './mts-workbench.component';

describe('DemandOrderManagementMtsWorkbenchComponent', () => {
  let component: DemandOrderManagementMtsWorkbenchComponent;
  let fixture: ComponentFixture<DemandOrderManagementMtsWorkbenchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementMtsWorkbenchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementMtsWorkbenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
