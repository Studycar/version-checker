import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BasePsbomViewComponent } from './view.component';

describe('BasePsbomViewComponent', () => {
  let component: BasePsbomViewComponent;
  let fixture: ComponentFixture<BasePsbomViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasePsbomViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasePsbomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
