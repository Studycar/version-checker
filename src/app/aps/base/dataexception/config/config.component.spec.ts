import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseDataexceptionConfigComponent } from './config.component';

describe('BaseDataexceptionConfigComponent', () => {
  let component: BaseDataexceptionConfigComponent;
  let fixture: ComponentFixture<BaseDataexceptionConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseDataexceptionConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDataexceptionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
