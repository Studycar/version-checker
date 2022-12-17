import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadShiftsEditComponent } from './edit.component';

describe('LoadShiftsEditComponent', () => {
  let component: LoadShiftsEditComponent;
  let fixture: ComponentFixture<LoadShiftsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadShiftsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadShiftsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
