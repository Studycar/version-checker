import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformPurchaseregionEditComponent } from './edit.component';

describe('PreparationPlatformPurchaseregionEditComponent', () => {
  let component: PreparationPlatformPurchaseregionEditComponent;
  let fixture: ComponentFixture<PreparationPlatformPurchaseregionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformPurchaseregionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformPurchaseregionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
