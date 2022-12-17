import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseDataexceptionCalculateComponent } from './calculate.component';

describe('BaseDataexceptionCalculateComponent', () => {
  let component: BaseDataexceptionCalculateComponent;
  let fixture: ComponentFixture<BaseDataexceptionCalculateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseDataexceptionCalculateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDataexceptionCalculateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
