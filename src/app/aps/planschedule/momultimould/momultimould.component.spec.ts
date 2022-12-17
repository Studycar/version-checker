import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MoMultimouldManageComponent } from './momultimould.component';

describe('MoMultimouldManageComponent', () => {
  let component: MoMultimouldManageComponent;
  let fixture: ComponentFixture<MoMultimouldManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoMultimouldManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoMultimouldManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
