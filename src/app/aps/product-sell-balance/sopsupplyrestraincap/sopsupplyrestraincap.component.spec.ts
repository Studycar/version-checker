import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SopSupplyRestrainCapComponent } from './sopsupplyrestraincap.component';

describe('SopSupplyRestrainCapComponent', () => {
  let component: SopSupplyRestrainCapComponent;
  let fixture: ComponentFixture<SopSupplyRestrainCapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopSupplyRestrainCapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopSupplyRestrainCapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
