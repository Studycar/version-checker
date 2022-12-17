import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {AttachInfoComponent} from './attachInfo.component';



describe('AttachInfoComponentModule', () => {
  let component: AttachInfoComponent;
  let fixture: ComponentFixture<AttachInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
