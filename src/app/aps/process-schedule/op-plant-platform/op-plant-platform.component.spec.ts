import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OPPlantPlatformComponent } from './op-plant-platform.component';

describe('OPPlantPlatformComponent', () => {
  let component: OPPlantPlatformComponent;
  let fixture: ComponentFixture<OPPlantPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OPPlantPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OPPlantPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
