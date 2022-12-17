import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PsProdPurchaseEditComponent } from './edit.component';

describe('PsItemRateEditComponent', () => {
  let component: PsProdPurchaseEditComponent;
  let fixture: ComponentFixture<PsProdPurchaseEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsProdPurchaseEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsProdPurchaseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
