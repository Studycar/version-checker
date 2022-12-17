import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementMtsWorkbenchViewComponent } from './view.component';

describe('DemandOrderManagementMtsWorkbenchViewComponent', () => {
  let component: DemandOrderManagementMtsWorkbenchViewComponent;
  let fixture: ComponentFixture<DemandOrderManagementMtsWorkbenchViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementMtsWorkbenchViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementMtsWorkbenchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
