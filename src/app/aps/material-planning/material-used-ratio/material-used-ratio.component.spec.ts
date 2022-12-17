import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialUsedRatioComponent } from './material-used-ratio.component';

describe('MaterialUsedRatioComponent', () => {
  let component: MaterialUsedRatioComponent;
  let fixture: ComponentFixture<MaterialUsedRatioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialUsedRatioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialUsedRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
