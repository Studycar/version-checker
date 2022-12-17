import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformItemcategoryEditComponent } from './edit.component';

describe('PreparationPlatformItemcategoryEditComponent', () => {
  let component: PreparationPlatformItemcategoryEditComponent;
  let fixture: ComponentFixture<PreparationPlatformItemcategoryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformItemcategoryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformItemcategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
