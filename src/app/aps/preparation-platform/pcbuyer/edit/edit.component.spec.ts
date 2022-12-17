import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformPcbuyerEditComponent } from './edit.component';

describe('PreparationPlatformPcbuyerEditComponent', () => {
  let component: PreparationPlatformPcbuyerEditComponent;
  let fixture: ComponentFixture<PreparationPlatformPcbuyerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformPcbuyerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformPcbuyerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
