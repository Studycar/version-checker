import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementMtsPlanOptionEditComponent } from './edit.component';

describe('DemandOrderManagementMtsPlanOptionEditComponent', () => {
  let component: DemandOrderManagementMtsPlanOptionEditComponent;
  let fixture: ComponentFixture<DemandOrderManagementMtsPlanOptionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementMtsPlanOptionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementMtsPlanOptionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
