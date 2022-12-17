import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformSupplierComponent } from './supplier.component';

describe('PreparationPlatformSupplierComponent', () => {
  let component: PreparationPlatformSupplierComponent;
  let fixture: ComponentFixture<PreparationPlatformSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
