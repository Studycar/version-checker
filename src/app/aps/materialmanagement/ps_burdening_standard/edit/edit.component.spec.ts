import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PsBurdeningStandardEditComponent } from './edit.component';

describe('PsItemRateEditComponent', () => {
  let component: PsBurdeningStandardEditComponent;
  let fixture: ComponentFixture<PsBurdeningStandardEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsBurdeningStandardEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsBurdeningStandardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
