import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TilesPlanscheduleMomanagerEditComponent } from './edit.component';

describe('PlanscheduleMomanagerEditComponent', () => {
  let component: TilesPlanscheduleMomanagerEditComponent;
  let fixture: ComponentFixture<TilesPlanscheduleMomanagerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TilesPlanscheduleMomanagerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TilesPlanscheduleMomanagerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
