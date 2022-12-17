import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PsBurdeningStandardExEditComponent } from './edit.component';

describe('PsItemRateEditComponent', () => {
  let component: PsBurdeningStandardExEditComponent;
  let fixture: ComponentFixture<PsBurdeningStandardExEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsBurdeningStandardExEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsBurdeningStandardExEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
