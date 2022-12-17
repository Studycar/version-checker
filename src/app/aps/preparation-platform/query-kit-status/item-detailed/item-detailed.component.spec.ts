import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformItemDetailedComponent } from './item-detailed.component';

describe('WorkingMaterialComponent', () => {
  let component: PreparationPlatformItemDetailedComponent;
  let fixture: ComponentFixture<PreparationPlatformItemDetailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformItemDetailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformItemDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
