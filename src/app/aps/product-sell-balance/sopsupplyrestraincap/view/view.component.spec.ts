import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SopSupplyRestrainCapViewComponent } from './view.component';

describe('SopSupplyRestrainCapViewComponent', () => {
  let component: SopSupplyRestrainCapViewComponent;
  let fixture: ComponentFixture<SopSupplyRestrainCapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopSupplyRestrainCapViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopSupplyRestrainCapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
