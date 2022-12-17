import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseMenuGroupPluginChildComponent } from './menu-group-plugin-child.component';

describe('BaseMenuGroupPluginChildComponent', () => {
  let component: BaseMenuGroupPluginChildComponent;
  let fixture: ComponentFixture<BaseMenuGroupPluginChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseMenuGroupPluginChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMenuGroupPluginChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
