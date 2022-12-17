import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SopSupplyRestrainCapEditComponent } from './edit.component';

describe('SopSupplyRestrainCapEditComponent', () => {
  let component: SopSupplyRestrainCapEditComponent;
  let fixture: ComponentFixture<SopSupplyRestrainCapEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopSupplyRestrainCapEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopSupplyRestrainCapEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
