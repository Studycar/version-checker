import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShipmentNoteComponent } from './shipment-note.component';

describe('ShipmentNoteComponent', () => {
  let component: ShipmentNoteComponent;
  let fixture: ComponentFixture<ShipmentNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
