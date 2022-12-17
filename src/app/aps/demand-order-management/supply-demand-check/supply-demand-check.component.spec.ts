import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplyDemandCheckComponent } from './supply-demand-check.component';

describe('SupplyDemandCheckComponent', () => {
  let component: SupplyDemandCheckComponent;
  let fixture: ComponentFixture<SupplyDemandCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplyDemandCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyDemandCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
