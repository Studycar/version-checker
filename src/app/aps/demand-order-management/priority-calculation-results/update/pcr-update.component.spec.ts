import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcrUpdateComponent } from './pcr-update.component';

describe('PcrUpdateComponent', () => {
  let component: PcrUpdateComponent;
  let fixture: ComponentFixture<PcrUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcrUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
