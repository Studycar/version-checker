import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseBaseparameterComponent } from './baseparameter.component';

describe('BaseBaseparameterComponent', () => {
  let component: BaseBaseparameterComponent;
  let fixture: ComponentFixture<BaseBaseparameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseBaseparameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseBaseparameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
