import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformShippingNoticeHfPoLackMaterialComponent } from './po-lack-material.component';

describe('PreparationPlatformShippingNoticeHfPoLackMaterialComponent', () => {
  let component: PreparationPlatformShippingNoticeHfPoLackMaterialComponent;
  let fixture: ComponentFixture<PreparationPlatformShippingNoticeHfPoLackMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformShippingNoticeHfPoLackMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformShippingNoticeHfPoLackMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
