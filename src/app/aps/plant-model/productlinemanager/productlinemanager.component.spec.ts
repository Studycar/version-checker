import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantModelProductlinemanagerComponent } from './productlinemanager.component';

describe('PlantModelProductlinemanagerComponent', () => {
  let component: PlantModelProductlinemanagerComponent;
  let fixture: ComponentFixture<PlantModelProductlinemanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantModelProductlinemanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantModelProductlinemanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
