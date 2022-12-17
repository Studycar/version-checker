import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SopPsMouldManagerComponent } from './psmould.component';

describe('InjectionMoldingMouldManagerComponent', () => {
  let component: SopPsMouldManagerComponent;
  let fixture: ComponentFixture<SopPsMouldManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopPsMouldManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopPsMouldManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
