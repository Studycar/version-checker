import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCustomLoadingComponent } from './grid-custom-loading.component';

describe('GridCustomLoadingComponent', () => {
  let component: GridCustomLoadingComponent;
  let fixture: ComponentFixture<GridCustomLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridCustomLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridCustomLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
