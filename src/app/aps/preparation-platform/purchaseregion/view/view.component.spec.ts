import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformPurchaseregionViewComponent } from './view.component';

describe('PreparationPlatformPurchaseregionViewComponent', () => {
  let component: PreparationPlatformPurchaseregionViewComponent;
  let fixture: ComponentFixture<PreparationPlatformPurchaseregionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformPurchaseregionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformPurchaseregionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
