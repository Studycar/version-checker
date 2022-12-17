import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformDemandputComponent } from './demandput.component';

describe('PreparationPlatformDemandputComponent', () => {
  let component: PreparationPlatformDemandputComponent;
  let fixture: ComponentFixture<PreparationPlatformDemandputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformDemandputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformDemandputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
