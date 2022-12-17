import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseUsermanagerrespEditComponent } from './edit.component';

describe('BaseUsermanagerrespEditComponent', () => {
  let component: BaseUsermanagerrespEditComponent;
  let fixture: ComponentFixture<BaseUsermanagerrespEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseUsermanagerrespEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseUsermanagerrespEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
