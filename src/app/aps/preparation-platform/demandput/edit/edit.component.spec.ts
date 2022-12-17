import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformDemandputEditComponent } from './edit.component';

describe('PreparationPlatformDemandputEditComponent', () => {
  let component: PreparationPlatformDemandputEditComponent;
  let fixture: ComponentFixture<PreparationPlatformDemandputEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformDemandputEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformDemandputEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
