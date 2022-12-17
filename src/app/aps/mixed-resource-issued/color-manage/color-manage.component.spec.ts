import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MixedResourceIssuedColorManageComponent } from './color-manage.component';

describe('MixedResourceIssuedColorManageComponent', () => {
  let component: MixedResourceIssuedColorManageComponent;
  let fixture: ComponentFixture<MixedResourceIssuedColorManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixedResourceIssuedColorManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixedResourceIssuedColorManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
