import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandViewDetailComponent } from './demand-view-detail.component';

describe('DemandViewDetailComponent', () => {
  let component: DemandViewDetailComponent;
  let fixture: ComponentFixture<DemandViewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandViewDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
