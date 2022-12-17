import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseFunctionmanagerEditComponent } from './edit.component';

describe('BaseFunctionmanagerEditComponent', () => {
  let component: BaseFunctionmanagerEditComponent;
  let fixture: ComponentFixture<BaseFunctionmanagerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseFunctionmanagerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFunctionmanagerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
