import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MixedResourceIssuedResourceIssuedPlatformComponent } from './resource-issued-platform.component';

describe('MixedResourceIssuedResourceIssuedPlatformComponent', () => {
  let component: MixedResourceIssuedResourceIssuedPlatformComponent;
  let fixture: ComponentFixture<MixedResourceIssuedResourceIssuedPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixedResourceIssuedResourceIssuedPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixedResourceIssuedResourceIssuedPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
