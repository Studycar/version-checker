import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcurrentRequestParameterFormComponent } from './parameter-form.component';

describe('ParameterFormComponent', () => {
  let component: ConcurrentRequestParameterFormComponent;
  let fixture: ComponentFixture<ConcurrentRequestParameterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestParameterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestParameterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
