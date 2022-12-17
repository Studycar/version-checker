import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformSupplierEditComponent } from './edit.component';

describe('PreparationPlatformSupplierEditComponent', () => {
  let component: PreparationPlatformSupplierEditComponent;
  let fixture: ComponentFixture<PreparationPlatformSupplierEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformSupplierEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformSupplierEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
