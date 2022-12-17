import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseDataexceptionEditComponent } from './edit.component';

describe('BaseDataexceptionEditComponent', () => {
  let component: BaseDataexceptionEditComponent;
  let fixture: ComponentFixture<BaseDataexceptionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseDataexceptionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDataexceptionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
