import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseMenuGroupPluginEditComponent } from './edit.component';

describe('BaseMenuGroupPluginEditComponent', () => {
  let component: BaseMenuGroupPluginEditComponent;
  let fixture: ComponentFixture<BaseMenuGroupPluginEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseMenuGroupPluginEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMenuGroupPluginEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
