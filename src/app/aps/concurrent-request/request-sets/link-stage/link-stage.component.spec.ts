import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkStageComponent } from './link-stage.component';

describe('LinkStageComponent', () => {
  let component: LinkStageComponent;
  let fixture: ComponentFixture<LinkStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LinkStageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
