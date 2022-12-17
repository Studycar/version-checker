import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformSuppliercontactEditComponent } from './edit.component';

describe('PreparationPlatformSuppliercontactEditComponent', () => {
  let component: PreparationPlatformSuppliercontactEditComponent;
  let fixture: ComponentFixture<PreparationPlatformSuppliercontactEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformSuppliercontactEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformSuppliercontactEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
