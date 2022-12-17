import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementMtsPlanOptionViewComponent } from './view.component';

describe('DemandOrderManagementMtsPlanOptionViewComponent', () => {
  let component: DemandOrderManagementMtsPlanOptionViewComponent;
  let fixture: ComponentFixture<DemandOrderManagementMtsPlanOptionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementMtsPlanOptionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementMtsPlanOptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
