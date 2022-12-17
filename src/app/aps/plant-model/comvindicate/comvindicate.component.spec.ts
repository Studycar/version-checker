import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComVindicateComponent } from './comvindicate.component';

describe('MaterialmanagementMaterialmaintenanceComponent', () => {
  let component: ComVindicateComponent;
  let fixture: ComponentFixture<ComVindicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComVindicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComVindicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
