import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseMessageprofileEditComponent } from './edit.component';

describe('BaseMessageprofileEditComponent', () => {
  let component: BaseMessageprofileEditComponent;
  let fixture: ComponentFixture<BaseMessageprofileEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseMessageprofileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMessageprofileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
