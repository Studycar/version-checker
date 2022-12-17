import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandCustomizationComponent } from './demand-customization.component';

describe('DemandCustomizationComponent', () => {
  let component: DemandCustomizationComponent;
  let fixture: ComponentFixture<DemandCustomizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandCustomizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
