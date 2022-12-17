import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OPGraphicalWorkbenchSearchComponent } from './op-graphical-workbench-search.component';

describe('SearchComponent', () => {
  let component: OPGraphicalWorkbenchSearchComponent;
  let fixture: ComponentFixture<OPGraphicalWorkbenchSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OPGraphicalWorkbenchSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OPGraphicalWorkbenchSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
