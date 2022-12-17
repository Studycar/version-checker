import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseMenumanagerEditComponent } from './edit.component';

describe('BaseMenumanagerEditComponent', () => {
  let component: BaseMenumanagerEditComponent;
  let fixture: ComponentFixture<BaseMenumanagerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseMenumanagerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMenumanagerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
