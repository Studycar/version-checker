import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanscheduleTilesMomanagerComponent } from './momanager.component';

describe('PlanscheduleMomanagerComponent', () => {
  let component: PlanscheduleTilesMomanagerComponent;
  let fixture: ComponentFixture<PlanscheduleTilesMomanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanscheduleTilesMomanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanscheduleTilesMomanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
