import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MixedResourceIssuedResourceIssuedPlatformEditColorComponent } from './edit-color.component';

describe('MixedResourceIssuedResourceIssuedPlatformEditColorComponent', () => {
  let component: MixedResourceIssuedResourceIssuedPlatformEditColorComponent;
  let fixture: ComponentFixture<MixedResourceIssuedResourceIssuedPlatformEditColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixedResourceIssuedResourceIssuedPlatformEditColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixedResourceIssuedResourceIssuedPlatformEditColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
