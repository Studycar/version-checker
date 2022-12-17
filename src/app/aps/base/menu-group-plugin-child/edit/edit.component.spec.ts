import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseMenuGroupPluginChildEditComponent } from './edit.component';

describe('BaseMenuGroupPluginChildEditComponent', () => {
  let component: BaseMenuGroupPluginChildEditComponent;
  let fixture: ComponentFixture<BaseMenuGroupPluginChildEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseMenuGroupPluginChildEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMenuGroupPluginChildEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
