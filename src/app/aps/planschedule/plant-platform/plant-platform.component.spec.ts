import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantPlatformComponent } from './plant-platform.component';

describe('PlantPlatformComponent', () => {
  let component: PlantPlatformComponent;
  let fixture: ComponentFixture<PlantPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
