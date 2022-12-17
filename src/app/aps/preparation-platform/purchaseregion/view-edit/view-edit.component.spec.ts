import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformPurchaseregionViewEditComponent } from './view-edit.component';

describe('PreparationPlatformPurchaseregionViewEditComponent', () => {
  let component: PreparationPlatformPurchaseregionViewEditComponent;
  let fixture: ComponentFixture<PreparationPlatformPurchaseregionViewEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformPurchaseregionViewEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformPurchaseregionViewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
