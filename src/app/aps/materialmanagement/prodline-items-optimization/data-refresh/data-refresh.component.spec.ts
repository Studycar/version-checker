import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRefreshComponent } from './data-refresh.component';

describe('DataRefreshComponent', () => {
  let component: DataRefreshComponent;
  let fixture: ComponentFixture<DataRefreshComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataRefreshComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
