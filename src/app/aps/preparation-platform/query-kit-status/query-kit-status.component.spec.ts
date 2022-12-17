import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformQueryKitStatusComponent } from './query-kit-status.component';

describe('BaseMenumanagerComponent', () => {
  let component: PreparationPlatformQueryKitStatusComponent;
  let fixture: ComponentFixture<PreparationPlatformQueryKitStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformQueryKitStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformQueryKitStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
