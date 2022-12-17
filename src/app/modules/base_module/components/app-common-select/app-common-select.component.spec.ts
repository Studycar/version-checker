import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPlantComponent } from './app-common-select.component';

describe('AppPlantComponent', () => {
  let component: AppPlantComponent;
  let fixture: ComponentFixture<AppPlantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPlantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
