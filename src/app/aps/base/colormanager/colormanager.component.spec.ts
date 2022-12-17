import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorManagerComponent } from './colormanager.component';

describe('MaterialmanagementMaterialmaintenanceComponent', () => {
  let component: ColorManagerComponent;
  let fixture: ComponentFixture<ColorManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
