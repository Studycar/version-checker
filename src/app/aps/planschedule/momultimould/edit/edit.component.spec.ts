import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MoMultiMouldEditComponent } from './edit.component';

describe('MoMultiMouldEditComponent', () => {
  let component: MoMultiMouldEditComponent;
  let fixture: ComponentFixture<MoMultiMouldEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoMultiMouldEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoMultiMouldEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
