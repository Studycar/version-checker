import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfmadeoutsourcingpercentmManageComponent } from './selfmadeoutsourcingpercent.component';

describe('SelfmadeoutsourcingpercentmManageComponent', () => {
  let component: SelfmadeoutsourcingpercentmManageComponent;
  let fixture: ComponentFixture<SelfmadeoutsourcingpercentmManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfmadeoutsourcingpercentmManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfmadeoutsourcingpercentmManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
