import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseFlexValueSetsEditComponent } from './edit.component';

describe('BaseFlexValueSetsEditComponent', () => {
  let component: BaseFlexValueSetsEditComponent;
  let fixture: ComponentFixture<BaseFlexValueSetsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseFlexValueSetsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFlexValueSetsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
