import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementSafestockViewComponent } from './view.component';

describe('DemandOrderManagementSafestockViewComponent', () => {
  let component: DemandOrderManagementSafestockViewComponent;
  let fixture: ComponentFixture<DemandOrderManagementSafestockViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementSafestockViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementSafestockViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
