import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseBaserespmanagerEditComponent } from './edit.component';

describe('BaseBaserespmanagerEditComponent', () => {
  let component: BaseBaserespmanagerEditComponent;
  let fixture: ComponentFixture<BaseBaserespmanagerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseBaserespmanagerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseBaserespmanagerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
