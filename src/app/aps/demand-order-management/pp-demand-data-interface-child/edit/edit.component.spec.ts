import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementPpDemandDataInterfaceChildEditComponent } from './edit.component';

describe('DemandOrderManagementPpDemandDataInterfaceChildEditComponent', () => {
  let component: DemandOrderManagementPpDemandDataInterfaceChildEditComponent;
  let fixture: ComponentFixture<DemandOrderManagementPpDemandDataInterfaceChildEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementPpDemandDataInterfaceChildEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementPpDemandDataInterfaceChildEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
