import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplyViewDetailComponent } from './supply-view-detail.component';

describe('SupplyViewDetailComponent', () => {
  let component: SupplyViewDetailComponent;
  let fixture: ComponentFixture<SupplyViewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplyViewDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
