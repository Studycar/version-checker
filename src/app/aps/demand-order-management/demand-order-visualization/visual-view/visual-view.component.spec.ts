import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualView } from './visual-view.component';

describe('VisualView', () => {
  let component: VisualView;
  let fixture: ComponentFixture<VisualView>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualView ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
