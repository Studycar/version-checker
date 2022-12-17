import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformWorkingMaterialComponent } from './working-material.component';

describe('WorkingMaterialComponent', () => {
  let component: PreparationPlatformWorkingMaterialComponent;
  let fixture: ComponentFixture<PreparationPlatformWorkingMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformWorkingMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformWorkingMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
