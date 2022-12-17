import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseBaseparameterViewEditComponent } from './view-edit.component';

describe('BaseBaseparameterViewEditComponent', () => {
  let component: BaseBaseparameterViewEditComponent;
  let fixture: ComponentFixture<BaseBaseparameterViewEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseBaseparameterViewEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseBaseparameterViewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
