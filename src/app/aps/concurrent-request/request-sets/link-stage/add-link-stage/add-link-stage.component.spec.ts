import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLinkStageComponent } from './add-link-stage.component';

describe('AddLinkStageComponent', () => {
  let component: AddLinkStageComponent;
  let fixture: ComponentFixture<AddLinkStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddLinkStageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLinkStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
