import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcrDetailComponent } from './pcr-detail.component';

describe('PcrDetailComponent', () => {
  let component: PcrDetailComponent;
  let fixture: ComponentFixture<PcrDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcrDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcrDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
