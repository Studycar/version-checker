import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PsItemRateEditComponent } from './edit.component';

describe('PsItemRateEditComponent', () => {
  let component: PsItemRateEditComponent;
  let fixture: ComponentFixture<PsItemRateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsItemRateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsItemRateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
