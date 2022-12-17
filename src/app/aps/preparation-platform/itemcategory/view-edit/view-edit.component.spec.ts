import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformItemcategoryViewEditComponent } from './view-edit.component';

describe('PreparationPlatformItemcategoryViewEditComponent', () => {
  let component: PreparationPlatformItemcategoryViewEditComponent;
  let fixture: ComponentFixture<PreparationPlatformItemcategoryViewEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformItemcategoryViewEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformItemcategoryViewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
