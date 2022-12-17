import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseMessageEditComponent } from './edit.component';

describe('BaseMessageEditComponent', () => {
  let component: BaseMessageEditComponent;
  let fixture: ComponentFixture<BaseMessageEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseMessageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMessageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
