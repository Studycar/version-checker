import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementMtsPlanOptionChildViewComponent } from './view.component';

describe('DemandOrderManagementMtsPlanOptionChildViewComponent', () => {
  let component: DemandOrderManagementMtsPlanOptionChildViewComponent;
  let fixture: ComponentFixture<DemandOrderManagementMtsPlanOptionChildViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementMtsPlanOptionChildViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementMtsPlanOptionChildViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
