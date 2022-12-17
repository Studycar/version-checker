import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ERPJobTypeComponent } from './erpjobtype.component';

describe('ERPJobTypeComponent', () => {
  let component: ERPJobTypeComponent;
  let fixture: ComponentFixture<ERPJobTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ERPJobTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ERPJobTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
