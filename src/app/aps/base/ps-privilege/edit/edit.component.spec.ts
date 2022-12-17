import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BasePsPrivilegeEditComponent } from './edit.component';

describe('BasePsPrivilegeEditComponent', () => {
  let component: BasePsPrivilegeEditComponent;
  let fixture: ComponentFixture<BasePsPrivilegeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasePsPrivilegeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasePsPrivilegeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
