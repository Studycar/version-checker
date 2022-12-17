import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InjectionMoldingMouldManagerEditComponent } from './edit.component';

describe('InjectionMoldingMouldManagerEditComponent', () => {
  let component: InjectionMoldingMouldManagerEditComponent;
  let fixture: ComponentFixture<InjectionMoldingMouldManagerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InjectionMoldingMouldManagerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InjectionMoldingMouldManagerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
