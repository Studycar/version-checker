import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PsMarkupChargesEditComponent } from './edit.component';

describe('PsMarkupChargesEditComponent', () => {
  let component: PsMarkupChargesEditComponent;
  let fixture: ComponentFixture<PsMarkupChargesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsMarkupChargesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsMarkupChargesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
