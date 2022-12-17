import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformUseritemcategoryComponent } from './useritemcategory.component';

describe('PreparationPlatformUseritemcategoryComponent', () => {
  let component: PreparationPlatformUseritemcategoryComponent;
  let fixture: ComponentFixture<PreparationPlatformUseritemcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformUseritemcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformUseritemcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
