import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MoBatchReleaseComponent } from './mobatchrelease.component';

describe('MaterialmanagementMaterialmaintenanceComponent', () => {
  let component: MoBatchReleaseComponent;
  let fixture: ComponentFixture<MoBatchReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoBatchReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoBatchReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
