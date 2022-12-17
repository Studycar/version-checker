import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PCPurchaseOrderManagementViewComponent } from './view.component';

describe('PreparationPlatformPcbuyerEditComponent', () => {
  let component: PCPurchaseOrderManagementViewComponent;
  let fixture: ComponentFixture<PCPurchaseOrderManagementViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PCPurchaseOrderManagementViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PCPurchaseOrderManagementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
