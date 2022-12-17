import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformPurItemDetailedComponent } from './item-detailed.component';

describe('WorkingMaterialComponent', () => {
  let component: PreparationPlatformPurItemDetailedComponent;
  let fixture: ComponentFixture<PreparationPlatformPurItemDetailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformPurItemDetailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformPurItemDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
