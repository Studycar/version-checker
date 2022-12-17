import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantModelItemRelationEditComponent } from './edit.component';

describe('PlantModelItemRelationEditComponent', () => {
  let component: PlantModelItemRelationEditComponent;
  let fixture: ComponentFixture<PlantModelItemRelationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantModelItemRelationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantModelItemRelationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
