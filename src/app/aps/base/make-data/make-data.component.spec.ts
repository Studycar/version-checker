import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MakeDataComponent } from './make-data.component';

describe('MakeDataComponent', () => {
  let component: MakeDataComponent;
  let fixture: ComponentFixture<MakeDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
