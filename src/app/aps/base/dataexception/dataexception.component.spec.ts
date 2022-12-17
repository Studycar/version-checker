import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseDataexceptionComponent } from './dataexception.component';

describe('BaseDataexceptionComponent', () => {
  let component: BaseDataexceptionComponent;
  let fixture: ComponentFixture<BaseDataexceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseDataexceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDataexceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
