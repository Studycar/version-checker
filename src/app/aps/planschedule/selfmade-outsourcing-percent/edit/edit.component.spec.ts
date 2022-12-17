import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfmadeoutsourcingpercentEditComponent } from './edit.component';

describe('SelfmadeoutsourcingpercentEditComponent', () => {
  let component: SelfmadeoutsourcingpercentEditComponent;
  let fixture: ComponentFixture<SelfmadeoutsourcingpercentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfmadeoutsourcingpercentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfmadeoutsourcingpercentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
