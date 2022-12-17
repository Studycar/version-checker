import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BomChangeRequestComponent } from './bom-change-request.component';

describe('BomChangeRequestComponent', () => {
  let component: BomChangeRequestComponent;
  let fixture: ComponentFixture<BomChangeRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomChangeRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
