import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformItemcategoryComponent } from './itemcategory.component';

describe('PreparationPlatformItemcategoryComponent', () => {
  let component: PreparationPlatformItemcategoryComponent;
  let fixture: ComponentFixture<PreparationPlatformItemcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformItemcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformItemcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
