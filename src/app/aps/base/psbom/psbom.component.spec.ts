import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BasePsbomComponent } from './psbom.component';

describe('BasePsbomComponent', () => {
  let component: BasePsbomComponent;
  let fixture: ComponentFixture<BasePsbomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasePsbomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasePsbomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
