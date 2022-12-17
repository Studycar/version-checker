import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformItemcategoryView2Component } from './view2.component';

describe('PreparationPlatformItemcategoryView2Component', () => {
  let component: PreparationPlatformItemcategoryView2Component;
  let fixture: ComponentFixture<PreparationPlatformItemcategoryView2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformItemcategoryView2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformItemcategoryView2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
