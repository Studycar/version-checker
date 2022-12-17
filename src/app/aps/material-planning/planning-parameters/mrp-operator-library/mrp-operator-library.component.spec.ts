import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrpOperatorLibraryComponent } from './mrp-operator-library.component';

describe('MrpOperatorLibraryComponent', () => {
  let component: MrpOperatorLibraryComponent;
  let fixture: ComponentFixture<MrpOperatorLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrpOperatorLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrpOperatorLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
