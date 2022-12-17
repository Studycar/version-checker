import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPopupSelectComponent } from './app-popup-select.component';

describe('AppPopupSelectComponent', () => {
  let component: AppPopupSelectComponent;
  let fixture: ComponentFixture<AppPopupSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPopupSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPopupSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
