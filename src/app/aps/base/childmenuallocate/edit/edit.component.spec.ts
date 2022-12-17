import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseChildmenuallocateEditComponent } from './edit.component';

describe('BaseChildmenuallocateEditComponent', () => {
  let component: BaseChildmenuallocateEditComponent;
  let fixture: ComponentFixture<BaseChildmenuallocateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseChildmenuallocateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseChildmenuallocateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
