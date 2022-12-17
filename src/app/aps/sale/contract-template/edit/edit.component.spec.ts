import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AttachInfoEditComponent } from './edit.component';

describe('AttachInfoEditComponent', () => {
  let component: AttachInfoEditComponent;
  let fixture: ComponentFixture<AttachInfoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachInfoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachInfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
