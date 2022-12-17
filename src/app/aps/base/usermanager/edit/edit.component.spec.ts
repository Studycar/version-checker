import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseUsermanagerEditComponent } from './edit.component';

describe('BaseUsermanagerEditComponent', () => {
  let component: BaseUsermanagerEditComponent;
  let fixture: ComponentFixture<BaseUsermanagerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseUsermanagerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseUsermanagerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
