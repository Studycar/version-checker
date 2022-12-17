import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseMessageComponent } from './message.component';

describe('BaseMessageComponent', () => {
  let component: BaseMessageComponent;
  let fixture: ComponentFixture<BaseMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
