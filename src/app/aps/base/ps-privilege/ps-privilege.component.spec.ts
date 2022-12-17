import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BasePsPrivilegeComponent } from './ps-privilege.component';

describe('BasePsPrivilegeComponent', () => {
  let component: BasePsPrivilegeComponent;
  let fixture: ComponentFixture<BasePsPrivilegeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasePsPrivilegeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasePsPrivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
