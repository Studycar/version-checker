import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SopSupplyRestrainCapViewEditComponent } from './view-edit.component';

describe('SopSupplyRestrainCapViewEditComponent', () => {
  let component: SopSupplyRestrainCapViewEditComponent;
  let fixture: ComponentFixture<SopSupplyRestrainCapViewEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopSupplyRestrainCapViewEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopSupplyRestrainCapViewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
