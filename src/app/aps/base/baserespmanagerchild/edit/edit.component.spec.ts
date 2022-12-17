import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseBaserespmanagerchildEditComponent } from './edit.component';

describe('BaseBaserespmanagerchildEditComponent', () => {
  let component: BaseBaserespmanagerchildEditComponent;
  let fixture: ComponentFixture<BaseBaserespmanagerchildEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseBaserespmanagerchildEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseBaserespmanagerchildEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
