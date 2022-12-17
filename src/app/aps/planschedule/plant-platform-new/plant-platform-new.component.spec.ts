import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantPlatformNewComponent } from './plant-platform-new.component';

describe('PlantPlatformNewComponent', () => {
  let component: PlantPlatformNewComponent;
  let fixture: ComponentFixture<PlantPlatformNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantPlatformNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantPlatformNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
