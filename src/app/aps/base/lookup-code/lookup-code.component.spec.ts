import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseLookupCodeComponent } from './lookup-code.component';

describe('LookupCodeComponent', () => {
  let component: BaseLookupCodeComponent;
  let fixture: ComponentFixture<BaseLookupCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseLookupCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLookupCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
