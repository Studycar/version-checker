import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseBillNoRecordViewComponent } from './bill-no-record-view.component';

describe('BaseBillNoRecordViewComponent', () => {
  let component: BaseBillNoRecordViewComponent;
  let fixture: ComponentFixture<BaseBillNoRecordViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseBillNoRecordViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseBillNoRecordViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
