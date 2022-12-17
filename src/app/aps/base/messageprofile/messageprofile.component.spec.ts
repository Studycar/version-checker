import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseMessageprofileComponent } from './messageprofile.component';

describe('BaseMessageprofileComponent', () => {
  let component: BaseMessageprofileComponent;
  let fixture: ComponentFixture<BaseMessageprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseMessageprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMessageprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
