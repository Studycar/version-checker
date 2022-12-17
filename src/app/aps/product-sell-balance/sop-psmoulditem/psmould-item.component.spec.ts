import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SopPsMouldItemManagerComponent } from './psmould-item.component';

describe('InjectionMoldingMouldManagerComponent', () => {
  let component: SopPsMouldItemManagerComponent;
  let fixture: ComponentFixture<SopPsMouldItemManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopPsMouldItemManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopPsMouldItemManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
