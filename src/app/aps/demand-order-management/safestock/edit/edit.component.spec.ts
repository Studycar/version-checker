import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandOrderManagementSafestockEditComponent } from './edit.component';

describe('DemandOrderManagementSafestockEditComponent', () => {
  let component: DemandOrderManagementSafestockEditComponent;
  let fixture: ComponentFixture<DemandOrderManagementSafestockEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandOrderManagementSafestockEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandOrderManagementSafestockEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
