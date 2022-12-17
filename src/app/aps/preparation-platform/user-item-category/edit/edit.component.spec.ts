import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformUserItemCategoryEditComponent } from './edit.component';

describe('PreparationPlatformUserItemCategoryEditComponent', () => {
  let component: PreparationPlatformUserItemCategoryEditComponent;
  let fixture: ComponentFixture<PreparationPlatformUserItemCategoryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformUserItemCategoryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformUserItemCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
