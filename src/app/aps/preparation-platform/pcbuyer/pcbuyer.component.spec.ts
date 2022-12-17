import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformPcbuyerComponent } from './pcbuyer.component';

describe('PreparationPlatformPcbuyerComponent', () => {
  let component: PreparationPlatformPcbuyerComponent;
  let fixture: ComponentFixture<PreparationPlatformPcbuyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformPcbuyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformPcbuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
