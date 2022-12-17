import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OPPlantPlatformSearchComponent } from './op-search.component';

describe('SearchComponent', () => {
  let component: OPPlantPlatformSearchComponent;
  let fixture: ComponentFixture<OPPlantPlatformSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OPPlantPlatformSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OPPlantPlatformSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
