import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformSuppliercontactComponent } from './suppliercontact.component';

describe('PreparationPlatformSuppliercontactComponent', () => {
  let component: PreparationPlatformSuppliercontactComponent;
  let fixture: ComponentFixture<PreparationPlatformSuppliercontactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformSuppliercontactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformSuppliercontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
