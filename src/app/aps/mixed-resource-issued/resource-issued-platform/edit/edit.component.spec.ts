import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MixedResourceIssuedResourceIssuedPlatformEditComponent } from './edit.component';

describe('MixedResourceIssuedResourceIssuedPlatformEditComponent', () => {
  let component: MixedResourceIssuedResourceIssuedPlatformEditComponent;
  let fixture: ComponentFixture<MixedResourceIssuedResourceIssuedPlatformEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixedResourceIssuedResourceIssuedPlatformEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixedResourceIssuedResourceIssuedPlatformEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
