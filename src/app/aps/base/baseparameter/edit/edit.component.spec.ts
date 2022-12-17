import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseBaseparameterEditComponent } from './edit.component';

describe('BaseBaseparameterEditComponent', () => {
  let component: BaseBaseparameterEditComponent;
  let fixture: ComponentFixture<BaseBaseparameterEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseBaseparameterEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseBaseparameterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
