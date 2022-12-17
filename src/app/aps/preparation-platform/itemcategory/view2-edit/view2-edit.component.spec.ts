import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformItemcategoryView2EditComponent } from './view2-edit.component';

describe('PreparationPlatformItemcategoryView2EditComponent', () => {
  let component: PreparationPlatformItemcategoryView2EditComponent;
  let fixture: ComponentFixture<PreparationPlatformItemcategoryView2EditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformItemcategoryView2EditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformItemcategoryView2EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
