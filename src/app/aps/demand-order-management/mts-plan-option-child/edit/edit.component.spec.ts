import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementMtsPlanOptionChildEditComponent } from './edit.component';

describe('DemandOrderManagementMtsPlanOptionChildEditComponent', () => {
  let component: DemandOrderManagementMtsPlanOptionChildEditComponent;
  let fixture: ComponentFixture<DemandOrderManagementMtsPlanOptionChildEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementMtsPlanOptionChildEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementMtsPlanOptionChildEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
