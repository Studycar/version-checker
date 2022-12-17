import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplyCustomizationComponent } from './supply-customization.component';

describe('SupplyCustomizationComponent', () => {
  let component: SupplyCustomizationComponent;
  let fixture: ComponentFixture<SupplyCustomizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupplyCustomizationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
