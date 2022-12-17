import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantModelProductlinemanagerEditComponent } from './edit.component';

describe('PlantModelProductlinemanagerEditComponent', () => {
  let component: PlantModelProductlinemanagerEditComponent;
  let fixture: ComponentFixture<PlantModelProductlinemanagerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantModelProductlinemanagerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantModelProductlinemanagerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
