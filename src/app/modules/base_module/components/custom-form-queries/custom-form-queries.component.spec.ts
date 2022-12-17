import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFormQueriesComponent } from './custom-form-queries.component';

describe('CustomFormQueriesComponent', () => {
  let component: CustomFormQueriesComponent;
  let fixture: ComponentFixture<CustomFormQueriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFormQueriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFormQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
