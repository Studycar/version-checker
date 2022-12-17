import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailComponent } from './viewDetail.component';

describe('ViewDetailComponent', () => {
  let component: ViewDetailComponent;
  let fixture: ComponentFixture<ViewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandMoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandMoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
