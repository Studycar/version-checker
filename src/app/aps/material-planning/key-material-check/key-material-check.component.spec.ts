import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyMaterialCheckComponent } from './key-material-check.component';

describe('KeyMaterialCheckComponent', () => {
  let component: KeyMaterialCheckComponent;
  let fixture: ComponentFixture<KeyMaterialCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyMaterialCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyMaterialCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
