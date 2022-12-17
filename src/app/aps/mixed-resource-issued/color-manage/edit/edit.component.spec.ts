import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MixedResourceIssuedColorManageEditComponent } from './edit.component';

describe('MixedResourceIssuedColorManageEditComponent', () => {
  let component: MixedResourceIssuedColorManageEditComponent;
  let fixture: ComponentFixture<MixedResourceIssuedColorManageEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixedResourceIssuedColorManageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixedResourceIssuedColorManageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
