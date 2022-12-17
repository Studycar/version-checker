import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseDataexceptionViewComponent } from './view.component';

describe('BaseDataexceptionViewComponent', () => {
  let component: BaseDataexceptionViewComponent;
  let fixture: ComponentFixture<BaseDataexceptionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseDataexceptionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDataexceptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
