import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementSafestockComponent } from './safestock.component';

describe('DemandOrderManagementSafestockComponent', () => {
  let component: DemandOrderManagementSafestockComponent;
  let fixture: ComponentFixture<DemandOrderManagementSafestockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementSafestockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementSafestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
