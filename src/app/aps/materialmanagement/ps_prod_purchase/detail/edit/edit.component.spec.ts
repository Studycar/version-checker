import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PsProdPurchaseExEditComponent } from './edit.component';

describe('PsItemRateEditComponent', () => {
  let component: PsProdPurchaseExEditComponent;
  let fixture: ComponentFixture<PsProdPurchaseExEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsProdPurchaseExEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsProdPurchaseExEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
