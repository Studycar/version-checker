import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantModelPlantmaintainEditComponent } from './edit.component';

describe('PlantModelPlantmaintainEditComponent', () => {
  let component: PlantModelPlantmaintainEditComponent;
  let fixture: ComponentFixture<PlantModelPlantmaintainEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantModelPlantmaintainEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantModelPlantmaintainEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
