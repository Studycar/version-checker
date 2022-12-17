import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MixedResourceIssuedResourceIssuedPlatformAgComponent } from './resource-issued-platform-ag.component';

describe('MixedResourceIssuedResourceIssuedPlatformAgComponent', () => {
  let component: MixedResourceIssuedResourceIssuedPlatformAgComponent;
  let fixture: ComponentFixture<MixedResourceIssuedResourceIssuedPlatformAgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixedResourceIssuedResourceIssuedPlatformAgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixedResourceIssuedResourceIssuedPlatformAgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
