import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseApplicationEditComponent } from './edit.component';

describe('EditComponent', () => {
  let component: BaseApplicationEditComponent;
  let fixture: ComponentFixture<BaseApplicationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseApplicationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseApplicationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
