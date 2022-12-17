import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantModelProlinegroupmaintainEditComponent } from './edit.component';

describe('PlantModelProlinegroupmaintainEditComponent', () => {
  let component: PlantModelProlinegroupmaintainEditComponent;
  let fixture: ComponentFixture<PlantModelProlinegroupmaintainEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantModelProlinegroupmaintainEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantModelProlinegroupmaintainEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
