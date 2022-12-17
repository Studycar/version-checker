import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseApplicationComponent } from './base-application.component';

describe('BaseApplicationComponent', () => {
  let component: BaseApplicationComponent;
  let fixture: ComponentFixture<BaseApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
