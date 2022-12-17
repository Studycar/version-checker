import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseFlexValueSetsDetailComponent } from './detail.component';

describe('BaseFlexValueSetsDetailComponent', () => {
  let component: BaseFlexValueSetsDetailComponent;
  let fixture: ComponentFixture<BaseFlexValueSetsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseFlexValueSetsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFlexValueSetsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
