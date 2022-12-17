import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LastQueryComponent } from './lastquery.component';

describe('ERPJobTypeComponent', () => {
  let component: LastQueryComponent;
  let fixture: ComponentFixture<LastQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
