import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseResprequestgroupEditComponent } from './edit.component';

describe('BaseResprequestgroupEditComponent', () => {
  let component: BaseResprequestgroupEditComponent;
  let fixture: ComponentFixture<BaseResprequestgroupEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseResprequestgroupEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseResprequestgroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
