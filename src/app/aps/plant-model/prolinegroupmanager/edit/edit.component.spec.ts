import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantModelProlinegroupmanagerEditComponent } from './edit.component';

describe('PlantModelProlinegroupmanagerEditComponent', () => {
  let component: PlantModelProlinegroupmanagerEditComponent;
  let fixture: ComponentFixture<PlantModelProlinegroupmanagerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantModelProlinegroupmanagerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantModelProlinegroupmanagerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
