import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseBaseparameterViewComponent } from './view.component';

describe('BaseBaseparameterViewComponent', () => {
  let component: BaseBaseparameterViewComponent;
  let fixture: ComponentFixture<BaseBaseparameterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseBaseparameterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseBaseparameterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
