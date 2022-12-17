import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PsMarkupChargesComponent } from './list.component';

describe('InjectionMoldingMouldManagerComponent', () => {
  let component: PsMarkupChargesComponent;
  let fixture: ComponentFixture<PsMarkupChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsMarkupChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsMarkupChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
