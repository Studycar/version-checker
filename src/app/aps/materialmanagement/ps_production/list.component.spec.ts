import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PsProductionComponent } from './list.component';

describe('InjectionMoldingMouldManagerComponent', () => {
  let component: PsProductionComponent;
  let fixture: ComponentFixture<PsProductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsProductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
