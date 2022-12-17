import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SopLongTermItemManageComponent } from './soplongtermitem.component';

describe('SopLongTermItemManageComponent', () => {
  let component: SopLongTermItemManageComponent;
  let fixture: ComponentFixture<SopLongTermItemManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopLongTermItemManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopLongTermItemManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
