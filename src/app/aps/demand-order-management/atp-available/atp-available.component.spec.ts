import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtpAvailableComponent } from './atp-available.component';

describe('AtpAvailableComponent', () => {
  let component: AtpAvailableComponent;
  let fixture: ComponentFixture<AtpAvailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtpAvailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtpAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
