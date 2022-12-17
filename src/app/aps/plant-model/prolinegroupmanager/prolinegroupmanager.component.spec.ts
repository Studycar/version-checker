import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantModelProlinegroupmanagerComponent } from './prolinegroupmanager.component';

describe('PlantModelProlinegroupmanagerComponent', () => {
  let component: PlantModelProlinegroupmanagerComponent;
  let fixture: ComponentFixture<PlantModelProlinegroupmanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantModelProlinegroupmanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantModelProlinegroupmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
