import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShipmentNoteDetailComponent } from './detail.component';

describe('ShipmentNoteDetailComponent', () => {
  let component: ShipmentNoteDetailComponent;
  let fixture: ComponentFixture<ShipmentNoteDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentNoteDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentNoteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
